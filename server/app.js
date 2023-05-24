
require('dotenv').config()
var express = require("express")
var cors = require('cors')
var app = express()
const path = require("path")
app.use(express.json());
app.use(cors(corsOptions));
const fs = require('fs');
const { env } = require('process')

const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        res.status(403).json({ error: 'No API key provided' });
    } else if (apiKey !== env.API_KEY) {
        res.status(403).json({ error: 'Invalid API key' });
    } else {
        next();
    }
};
app.use(checkApiKey);

var corsOptions = {
    "origin": function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    "methods": "GET,POST,DELETE,PUT,OPTIONS",
    "allowedHeaders": ["Content-Type", "Authorization", "Prompt"],
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.post('/ps', function (req, res) {
    console.log("****** New PS request ******")
    try {
        var command = req.body.command;
        var spawn = require("child_process").spawn, child;
        child = spawn("powershell.exe", ["-Command", command]);
        child.stdout.on("data", function (data) {
            res.write(data.toString());
        });
        child.stderr.on("data", function (data) {
            res.write(data.toString());
        });
        child.on("exit", function () {
            console.log("Powershell Script finished");
            res.end();
        });
        child.stdin.end();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.post('/pscreate', function (req, res) {
    console.log("****** New PS creation ******");

    const scriptName = req.body.scriptName;
    const scriptValue = req.body.scriptValue;
    const scriptDescription = req.body.scriptDescription;
    const scriptFolder = req.body.scriptFolder;

    const filePath = path.join(__dirname, 'Userscripts.json');

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    let fileData = fs.readFileSync(filePath);
    let scripts = JSON.parse(fileData);

    const existingScriptIndex = scripts.findIndex(script => script.scriptName === scriptName);

    if (existingScriptIndex !== -1) {
        scripts[existingScriptIndex].scriptValue = scriptValue;
        scripts[existingScriptIndex].scriptDescription = scriptDescription;
        scripts[existingScriptIndex].scriptFolder = scriptFolder;
    } else {
        const newScript = { scriptName, scriptValue, scriptDescription, scriptFolder };
        scripts.push(newScript);
    }

    fs.writeFile(filePath, JSON.stringify(scripts), function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating or updating PowerShell script');
        }

        const updatedScript = scripts.find(script => script.scriptName === scriptName);

        console.log('PowerShell script created or updated:', scriptName);
        res.status(200).json(updatedScript);
    });
});

app.get('/scripts', function (req, res) {
    console.log("****** New Scripts retrieval request ******");

    const filePath = path.join(__dirname, 'Userscripts.json');

    if (!fs.existsSync(filePath)) {
        return res.status(200).json([]);
    }

    let fileData = fs.readFileSync(filePath);
    let scripts = JSON.parse(fileData);

    let filteredScripts = scripts.filter(script => script.scriptFolder !== 'DELETED');

    console.log('Script retrieval successful');
    res.status(200).json(filteredScripts);
});

app.delete('/script', function (req, res) {
    console.log("****** New Script Deletion Request ******");
    const scriptName = req.body.scriptName;
    const filePath = path.join(__dirname, 'Userscripts.json');
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({ data: 'Script file does not exist' });
    }
    let fileData = fs.readFileSync(filePath);
    let scripts = JSON.parse(fileData);
    const scriptIndex = scripts.findIndex(script => script.scriptName === scriptName);
    if (scriptIndex === -1) {
        return res.status(404).send({ data: 'Script not found' });
    }
    scripts[scriptIndex].scriptFolder = 'DELETED';
    fs.writeFile(filePath, JSON.stringify(scripts), function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send({ data: "Error updating script" });
        }
        console.log('Script updated:', scriptName);
        res.status(200).send({ data: 'deleted' });
    });
});

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`App listening on port ${port}!`));


