import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface PollingState {
  status: 'pending' | 'completed' | 'failed';
  output?: string;
  error?: string;
  isResearching?: boolean;
}

export function useManusPolling(taskId: string | null, leadId: string | null) {
  const [state, setState] = useState<PollingState>({ status: 'pending', output: '', isResearching: false });
  const supabase = createClient();

  useEffect(() => {
    if (!taskId || !leadId) return;

    let pollCount = 0;
    let lastTextLength = 0;
    let stableCount = 0;
    const maxPolls = 150; 

    const pollTask = async () => {
      pollCount++;

      try {
        const response = await fetch(`/api/poll-task/${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch task status');
        const data = await response.json();
        
        const allTextSegments: string[] = [];
        let hasToolCalls = false;

        if (data.output && Array.isArray(data.output)) {
          data.output.forEach((msg: { type: string; role?: string; content?: Array<{ type: string; text?: string; fileUrl?: string; fileName?: string }> }, idx: number) => {
            if (msg.type === 'tool_call' || (msg.content && msg.content.some((c: { type: string }) => c.type === 'tool_call' || c.type === 'browsing'))) {
              hasToolCalls = true;
            }
            msg.content?.forEach((c: { type: string; text?: string }) => {
              if (c.type === 'output_text' && c.text) {
                if (idx === 0 && msg.role === 'user') return;
                allTextSegments.push(c.text);
              }
            });
          });
        }

        let combinedText = allTextSegments.join('\n\n').trim();
        
        // Clean up conversational filler (Manus AI specific preambles)
        const fillerPatterns = [
          /^I'll begin by analyzing.*?\n\n/is,
          /^I will start by.*?\n\n/is,
          /^Let me start by.*?\n\n/is,
          /^Based on the information provided, I'll.*?\n\n/is,
          /^I'll create a comprehensive Meta Ads strategy.*?\n\n/is
        ];

        fillerPatterns.forEach(pattern => {
          if (pattern.test(combinedText)) {
            combinedText = combinedText.replace(pattern, '').trim();
          }
        });

        const currentLength = combinedText.length;
        
        // Track if text has stopped growing
        if (currentLength > 0 && currentLength === lastTextLength) {
          stableCount++;
        } else {
          stableCount = 0;
        }
        lastTextLength = currentLength;

        const isResearching = (currentLength < 500 || hasToolCalls) && data.status === 'running';

        if (currentLength > 0) {
          setState(prev => ({ ...prev, output: combinedText, isResearching }));
        } else {
          setState(prev => ({ ...prev, isResearching }));
        }

        const isFinished = data.status === 'completed';
        const isRunningWithLotsOfText = data.status === 'running' && currentLength > 1500;
        const hasStoppedGrowing = stableCount >= 4 && currentLength > 500;

        if (isFinished || isRunningWithLotsOfText || hasStoppedGrowing) {
            setState({ status: 'completed', output: combinedText, isResearching: false });
            if (combinedText.length > 50) {
               await supabase.from('leads').update({ strategy_markdown: combinedText }).eq('id', leadId);
            }
            return; 
        }
        
        if (data.status === 'failed' || data.error) {
          setState(prev => ({ ...prev, status: 'failed', error: data.error || 'Manus AI reported a failure.' }));
        } else if (pollCount >= maxPolls) {
          setState(prev => ({ ...prev, status: 'failed', error: 'Generation timed out.' }));
        } else {
          setTimeout(pollTask, 5000); 
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setState(prev => ({ ...prev, status: 'failed', error: errorMessage }));
      }
    };

    pollTask();
  }, [taskId, leadId, supabase]);

  return state;
}