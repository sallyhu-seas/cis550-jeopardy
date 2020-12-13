# cis550-jeopardy

Instruction:
- Server:
    - Our server connects to Oracle. In order to run the application, please make sure you have Oracle Instant Client and SDK installed.
    - Once it's installed, update the path to the client in the routes.js file at the very top within oracledb.initOracleClient({ libDir: '<your path here>' })
    - Use npm start to run server (after npm install)
   
- Client: 
    - Use npm run serve -- --port 3000 to run client (after npm install)
    - If this fails, first delete the "node_modules" folder in the client folder and run npm i. Then try again.
