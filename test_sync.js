const http = require('http');

const encodedSession = 'eyJhY2Nlc3NfdG9rZW4iOiJleUpoYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1VeU5qRTJOR1ExTFdNME9EUXRORFJqWVMxaU5qUmpMV0V3Wm1JNFpqaGhPRGswWWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMM2w0WkhSdmJYaG5jM0ZoWjNBeGFtaDFkR2R4TG5OMWNHRmlZWE5sTG1OdkwyRjFkR2d2ZGpFaUxDSnpkV0lpT2lKaU1XSTVPRGN3TXkwMU56Vm1MVFJpWkRVdFlUQTFOaTAxWWpka1l6SmxZMkl5TkdZaUxDSmhkV1FpT2lKaGRYUm9aVzUwYVdOhdHVmtJaXdpWlhod0lqb3hOemN3TWpveE56Y3dNamcwTmpBd2ZWMHNJbk5sYzNOcGIyNWZhV1FpT2lJeFkySmlaR0kzTkMweVltUm1MVFJpWkRVdFlUQTFOaTAxWWpka1l6SmxZMkl5TkdZaUxDSmBjMTloYm05dWVXMXZkWE1pT21aaGJITmxmUS5SRi1RdU9uOWFnZlpTOVdkMjFZbTR4X20wVjBwcFp1STM1Z0otRDMwRW5lZW5LRm52aXZraWNwU215VjlFR1ZpNUozX2lmYy1XbjhHejNUenROVDh5USIsInRva2VuX3R5cGUiOiJiZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJleHBpcmVzX2F0IjoxNzcwMjg4MjAwLCJyZWZyZXNoX3Rva2VuIjoiNzJwd3I3eDN4bGtyIiwidXNlciI6eyJpZCI6ImIxYjk4NzAzLTU3NWYtNGJkNS1hMDU2LTViN2RjMmVjYjI0ZiIsImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImVtYWlsIjoiYXNocmFmYWJkdWxsYWg2ODFAZ21haWwuY29tIiwiZW1haWxfY29uZmlybWVkX2F0IjoiMjAyNi0wMi0wNFQxODo1NzoxMS4zNjgwMjFaIiwicGhvbmUiOiIiLCJjb25maXJtZWRfYXQiOiIyMDI2LTAyLTA0VDE4OjU3OjExLjM2ODAyMVoiLCJsYXN0X3NpZ25faW5fYXQiOiIyMDI2LTAyLTA1VDA5OjQzOjIwLjEzOTI1OTE0MVoiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImFzaHJhZmFiZHVsbGFoNjgxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJzdF9uYW1lIjoiQWJkdWxsYWgiLCJsYXN0X25hbWUiOiJBc2hyYWYiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImIxYjk4NzAzLTU3NWYtNGJkNS1hMDU2LTViN2RjMmVjYjI0ZiJ9LCJpZGVudGl0aWVzIjpbeyJpZGVudGl0eV9pZCI6IjQ1MjBhYTA3LWRiMzItNDcxNC05MTYwLWJhNTNjMTc4ZDU3MyIsImlkIjoiYjFiOTg3MDMtNTc1Zi00YmQ1LWEwNTYtNWI3ZGMyZWNiMjRmIiwidXNlcl9pZCI6ImIxYjk4NzAzLTU3NWYtNGJkNS1hMDU2LTViN2RjMmVjYjI0ZiIsImlkZW50aXR5X2RhdGEiOnsiZW1haWwiOiJhc2hyYWZhYmR1bGxhaDY4MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcnN0X25hbWUiOiJBYmR1bGxhaCIsImxhc3RfbmFtZSI6IkFzaHJhZiIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYjFiOTg3MDMtNTc1Zi00YmQ1LWEwNTYtNWI3ZGMyZWNiMjRmIn0sInByb3ZpZGVyIjoiZW1haWwiLCJsYXN0X3NpZ25faW5fYXQiOiIyMDI2LTAyLTA0VDE4OjU3OjExLjM2NTI5MloiLCJjcmVhdGVkX2F0IjoiMjAyNi0wMi0wNFQxODo1NzoxMS4zNjUzN1oiLCJ1cGRhdGVkX2F0IjoiMjAyNi0wMi0wNFQxODo1NzoxMS4zNjUzN1oiLCJlbWFpbCI6ImFzaHJhZmFiZHVsbGFoNjgxQGdtYWlsLmNvbSJ9XSwiY3JlYXRlZF9hdCI6IjIwMjYtMDItMDRUMTg6NTc6MTEuMzYxNzI0WiIsInVwZGF0ZWRfYXQiOiIyMDI2LTAyLTA1VDA5OjQzOjIwLjE4NTc2N1oiLCJpc19hbm9ueW1vdXMiOmZhbHNlfSwid2Vha19wYXNzd29yZCI6bnVsbH0=';
const leadId = '06ed225d-c836-45af-a4a0-32a3f3c01b5d';
const projectId = 'yxdtomxgsqaguqjhutgq';

async function testSync() {
    const data = JSON.stringify({ leadId });
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/ghl-sync',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            'Cookie': `sb-${projectId}-auth-token=${encodedSession}`
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
    });
    req.on('error', e => console.error(e));
    req.write(data);
    req.end();
}
testSync();
