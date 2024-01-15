// @bun
import A from"http";import k from"url";import J from"fs/promises";import x from"path";async function K(){try{await J.access(T)}catch(E){if(E.code==="ENOENT")await J.mkdir(T);else throw E}}async function L(E,$){const g=k.parse(E.url,!0).query.id;if(!g){$.writeHead(400,{"Content-Type":"text/plain"}),$.end('Bad Request: Missing "id" parameter\n');return}const m=x.join(T,`${g}.json`);try{await J.writeFile(m,"{}"),$.writeHead(200,{"Content-Type":"text/plain"}),$.end(`File ${g}.json created successfully\n`)}catch(H){$.writeHead(500,{"Content-Type":"text/plain"}),$.end(`Internal Server Error: ${H.message}\n`)}}async function M(E,$){const F=k.parse(E.url,!0),g=F.pathname?.split("/")[1],m=F.query.id;if(!g||!m){$.writeHead(400,{"Content-Type":"text/plain"}),$.end('Bad Request: Missing "id" parameter\n');return}const H=x.join(T,`${g}.json`);try{const C=await J.readFile(H,"utf-8"),w=JSON.parse(C);if(w[m])$.writeHead(200,{"Content-Type":"application/json"}),$.end(JSON.stringify({[m]:w[m]}));else $.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: Key "${m}" not found in file ${g}.json\n`)}catch(C){if(C.code==="ENOENT")$.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: File ${g}.json does not exist\n`);else $.writeHead(500,{"Content-Type":"text/plain"}),$.end(`Internal Server Error: ${C.message}\n`)}}async function N(E,$){const F=k.parse(E.url,!0),g=F.pathname?.split("/")[1],m=F.query.id,H=F.query.data;if(!g||!m||!H){$.writeHead(400,{"Content-Type":"text/plain"}),$.end('Bad Request: Missing "id", "data", or "value" parameter\n');return}const C=x.join(T,`${g}.json`);try{const w=await J.readFile(C,"utf-8"),c=JSON.parse(w);c[m]=H,await J.writeFile(C,JSON.stringify(c)),$.writeHead(200,{"Content-Type":"text/plain"}),$.end(`Data stored successfully for key "${m}" in file ${g}.json\n`)}catch(w){if(w.code==="ENOENT")$.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: File ${g}.json does not exist\n`);else $.writeHead(500,{"Content-Type":"text/plain"}),$.end(`Internal Server Error: ${w.message}\n`)}}async function Q(E,$){const F=k.parse(E.url,!0),g=F.pathname?.split("/")[1],m=F.query.id,H=F.query.data;if(!g||!m||!H){$.writeHead(400,{"Content-Type":"text/plain"}),$.end('Bad Request: Missing "id", "data", or "value" parameter\n');return}const C=x.join(T,`${g}.json`);try{const w=await J.readFile(C,"utf-8"),c=JSON.parse(w);if(c[m])c[m]=H,await J.writeFile(C,JSON.stringify(c)),$.writeHead(200,{"Content-Type":"text/plain"}),$.end(`Data updated successfully for key "${m}" in file ${g}.json\n`);else $.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: Key "${m}" not found in file ${g}.json\n`)}catch(w){if(w.code==="ENOENT")$.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: File ${g}.json does not exist\n`);else $.writeHead(500,{"Content-Type":"text/plain"}),$.end(`Internal Server Error: ${w.message}\n`)}}async function S(E,$){const F=k.parse(E.url,!0),g=F.pathname?.split("/")[1],m=F.query.id;if(!g||!m){$.writeHead(400,{"Content-Type":"text/plain"}),$.end('Bad Request: Missing "id" or "value-to-delete" parameter\n');return}const H=x.join(T,`${g}.json`);try{const C=await J.readFile(H,"utf-8"),w=JSON.parse(C);if(w[m])delete w[m],await J.writeFile(H,JSON.stringify(w)),$.writeHead(200,{"Content-Type":"text/plain"}),$.end(`Data deleted successfully for key "${m}" in file ${g}.json\n`);else $.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: Key "${m}" not found in file ${g}.json\n`)}catch(C){if(C.code==="ENOENT")$.writeHead(404,{"Content-Type":"text/plain"}),$.end(`Not Found: File ${g}.json does not exist\n`);else $.writeHead(500,{"Content-Type":"text/plain"}),$.end(`Internal Server Error: ${C.message}\n`)}}var T=process.env.DIR||"db",z=process.env.PORT||9052,V=A.createServer(async(E,$)=>{switch(await K(),E.method){case"GET":if(E.url?.startsWith("/new"))L(E,$);else if(E.url?.match(/^\/\w+\/get/))M(E,$);else if(E.url?.match(/^\/\w+\/store/))N(E,$);else if(E.url?.match(/^\/\w+\/patch/))Q(E,$);else if(E.url?.match(/^\/\w+\/delete/))S(E,$);else $.writeHead(404,{"Content-Type":"text/plain"});$.end("Function Not Found\n");break;default:$.writeHead(405,{"Content-Type":"text/plain"}),$.end("Method Not Allowed\n")}});V.listen(z,()=>{console.log(`Server running on port ${z}`)});