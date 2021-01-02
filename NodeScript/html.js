const fs = require('fs').promises;
const path = require('path');
const fsStream = require('fs');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    html:{
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*' 

    },
    javascript:{
        'Content-Type': 'text/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*' 
    },
    css:{
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    png:{
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'

    } 

}

async function deliver(pathName, req,resp){
    let type;
    let data;
    let path = "." + pathName;
    let enconding = 'utf8';

    
    if(pathName.endsWith('css')){
        type = 'css';
    }
    if (pathName.endsWith('js')){
        type = 'javascript';
    }
    if(pathName.endsWith('png')){
        type = 'png';
        enconding = 'binary';
    }
    if(pathName.endsWith('/')){
        type = 'html';
        path = "index.html";
    }
    
    
    try{
        data = await fs.readFile(path, enconding);
        resp.writeHead(200, headers[type]);
        resp.write(data,enconding);
        resp.end();

        } 
    catch(err){
        console.log(err);
    }
}


module.exports.deliver = deliver;