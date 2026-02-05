import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    const response = await fetch(`https://api.manus.ai/v1/tasks/${taskId}`, {
      headers: {
        'API_KEY': process.env.MANUS_API_KEY || '',
      },
    });

    const data = await response.json();

    // Check if there is a strategy file that needs to be merged into the text output
    if (data.output && Array.isArray(data.output)) {
      for (const msg of data.output) {
        if (msg.content && Array.isArray(msg.content)) {
          for (const item of msg.content) {
            if (item.type === 'output_file' && item.fileName?.endsWith('.md') && item.fileUrl) {
              try {
                const fileRes = await fetch(item.fileUrl);
                if (fileRes.ok) {
                  const fileContent = await fileRes.text();
                  // Inject the file content as a new text item so the frontend sees it as standard output
                  msg.content.push({
                    type: 'output_text',
                    text: `\n\n${fileContent}`
                  });
                }
              } catch (e) {
                console.error("Failed to fetch strategy file content", e);
              }
            }
          }
        }
      }
    }

    if (!response.ok) {
      console.error('Manus API Error:', data);
      return NextResponse.json({ error: 'Manus API error', details: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Poll task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}