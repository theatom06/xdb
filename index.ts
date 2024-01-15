import http from 'http';
import url from 'url';
import fs from 'fs/promises';
import path from 'path';

const DB_DIR = process.env.DIR || 'db';
const PORT = process.env.PORT || 9052 ;

async function ensureDbDir() {
    try {
        await fs.access(DB_DIR);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(DB_DIR);
        } else {
            throw error;
        }
    }
}

async function handleNew(req: http.IncomingMessage, res: http.ServerResponse) {
    const query = url.parse(req.url!, true).query;
    const fileId = query.id as string;
    if (!fileId) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('Bad Request: Missing "id" parameter\n');
        return;
    }
    const filePath = path.join(DB_DIR, `${fileId}.json`);
    try {
        await fs.writeFile(filePath, '{}');
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(`File ${fileId}.json created successfully\n`);
    } catch (error: any) {
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.end(`Internal Server Error: ${error.message}\n`);
    }
}

async function handleGet(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url!, true);
    const fileId = parsedUrl.pathname?.split('/')[1];
    const queryId = parsedUrl.query.id as string;
    if (!fileId || !queryId) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('Bad Request: Missing "id" parameter\n');
        return;
    }
    const filePath = path.join(DB_DIR, `${fileId}.json`);
    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);
        if (jsonData[queryId]) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                [queryId]: jsonData[queryId]
            }));
        } else {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end(`Not Found: Key "${queryId}" not found in file ${fileId}.json\n`);
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end(`Not Found: File ${fileId}.json does not exist\n`);
        } else {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end(`Internal Server Error: ${error.message}\n`);
        }
    }
}

async function handleStore(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url!, true);
    const fileId = parsedUrl.pathname?.split('/')[1];
    const queryId = parsedUrl.query.id as string;
    const queryData = parsedUrl.query.data as string;
    if (!fileId || !queryId || !queryData) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('Bad Request: Missing "id", "data", or "value" parameter\n');
        return;
    }
    const filePath = path.join(DB_DIR, `${fileId}.json`);
    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);
        jsonData[queryId] = queryData;
        await fs.writeFile(filePath, JSON.stringify(jsonData));
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(`Data stored successfully for key "${queryId}" in file ${fileId}.json\n`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.end(`Not Found: File ${fileId}.json does not exist\n`);
        } else {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end(`Internal Server Error: ${error.message}\n`);
        }
    }
}

async function handlePatch(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url!, true);
    const fileId = parsedUrl.pathname?.split('/')[1];
    const queryId = parsedUrl.query.id as string;
    const queryData = parsedUrl.query.data as string;

    if (!fileId || !queryId || !queryData) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Missing "id", "data", or "value" parameter\n');
        return;
    }

    const filePath = path.join(DB_DIR, `${fileId}.json`);

    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);

        if (jsonData[queryId]) {
            jsonData[queryId] = queryData;
            await fs.writeFile(filePath, JSON.stringify(jsonData));
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Data updated successfully for key "${queryId}" in file ${fileId}.json\n`);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not Found: Key "${queryId}" not found in file ${fileId}.json\n`);
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not Found: File ${fileId}.json does not exist\n`);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Internal Server Error: ${error.message}\n`);
        }
    }
}

async function handleDelete(req: http.IncomingMessage, res: http.ServerResponse) {
    const parsedUrl = url.parse(req.url!, true);
    const fileId = parsedUrl.pathname?.split('/')[1];
    const queryId = parsedUrl.query.id as string;

    if (!fileId || !queryId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Missing "id" or "value-to-delete" parameter\n');
        return;
    }

    const filePath = path.join(DB_DIR, `${fileId}.json`);

    try {
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);

        if (jsonData[queryId]) {
            delete jsonData[queryId];
            await fs.writeFile(filePath, JSON.stringify(jsonData));
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Data deleted successfully for key "${queryId}" in file ${fileId}.json\n`);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not Found: Key "${queryId}" not found in file ${fileId}.json\n`);
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`Not Found: File ${fileId}.json does not exist\n`);
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`Internal Server Error: ${error.message}\n`);
        }
    }
}

const server = http.createServer(async (req, res) => {
    await ensureDbDir();

    switch (req.method) {
        case 'GET':

            if (req.url?.startsWith('/new'))
                handleNew(req, res);

            else if (req.url?.match(/^\/\w+\/get/))
                handleGet(req, res);

            else if (req.url?.match(/^\/\w+\/store/))
                handleStore(req, res);

            else if (req.url?.match(/^\/\w+\/patch/))
                handlePatch(req, res);

            else if (req.url?.match(/^\/\w+\/delete/))
                handleDelete(req, res);

            else
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Function Not Found\n');
            
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed\n');
    }
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});