import React, { useRef, useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { BiDownload, BiEditAlt, BiPlayCircle, BiSave, BiTrash } from 'react-icons/bi';
import { ImCancelCircle } from 'react-icons/im';
import { FaUndo } from 'react-icons/fa';

const ScriptModule = ({ title, value, desc, folders, folderName, onDelete }) => {

    const textareaRef = useRef(null);
    const [code, setCode] = useState(value);
    const [description, setDescription] = useState(desc);
    const [scriptTitle, setScriptTitle] = useState(title);
    const [runScript, setRunScript] = useState(false);
    const [showConsole, setShowConsole] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(folderName);
    const [scriptChanged, setScriptChanged] = useState(false);

    function handleDownloadScript() {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${scriptTitle}.ps1`;
        link.click();
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        if (code.trim() !== value.trim() || description !== desc || selectedFolder !== folderName) {
            setScriptChanged(true);
        } else {
            setScriptChanged(false);
        }
    }, [code, value, description, desc, selectedFolder, folderName]);


    function handleSelectFolder(e) {
        setSelectedFolder(e.target.value);
    }

    function getNumberOfLines(text) {
        if (typeof text !== 'string') {
            console.error('getNumberOfLines: expected a string but got', text);
            return 0;
        }
        return text.split(/\r\n|\n|\r/).length;
    }

    function LineNumbers({ lines }) {
        return (
            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: 16,
                    paddingRight: '10px',
                    textAlign: 'right',
                    userSelect: 'none',
                    width: 15,
                    paddingTop: 38,
                    paddingLeft: 10,
                    color: 'gray',
                    position: 'absolute',
                }}
            >
                {Array.from({ length: lines }, (_, i) => i + 1).join('\n')}
            </div>
        );
    }

    const numLines = getNumberOfLines(code);
    function handleRunScript() {
        console.log('Running script: ' + scriptTitle);
        setCode(code + ' ')
        setExpanded(true)
        setShowConsole(true);
        setRunScript(true);
    }

    const StreamResponse = ({ input }) => {
        const [output, setOutput] = useState('');
        const [statusConsole, setStatusConsole] = useState('Console output:');

        useEffect(() => {
            let controller;
            let signal;

            const fetchData = async () => {
                controller = new AbortController();
                signal = controller.signal;

                try {
                    setStatusConsole('Running script...');
                    const response = await fetch(process.env.REACT_APP_API_URL + '/ps', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.REACT_APP_API_KEY,
                        },
                        body: JSON.stringify({ command: input }),
                        signal,
                    });

                    const reader = response.body?.getReader();
                    if (!reader) return;

                    const decoder = new TextDecoder('utf-8');

                    reader.read().then(function processText({ done, value }) {
                        if (done) {
                            setStatusConsole('Script completed');
                            return;
                        }

                        setOutput((prevOutput) => prevOutput + decoder.decode(value));
                        return reader.read().then(processText);
                    });
                } catch (error) {
                    if (error.name === 'AbortError') {
                    } else {
                        console.error('Fetch error:', error);
                    }
                }
            };
            if (runScript) {
                fetchData();
            }
            return () => {
                if (controller) controller.abort();
            };
        }, [input]);

        return (
            <div className="TileEditor" style={{ fontFamily: 'Itim', fontSize: 16, color: 'white', marginBottom: 10, borderStyle: 'none', paddingTop: 10 }}>
                <div style={{ position: 'relative' }}>
                    <ImCancelCircle
                        className="IconButtonsScript"
                        style={{ fontSize: 20, color: '#c45d34', position: 'absolute', top: 15, right: 10 }}
                        onClick={() => setShowConsole(false)}
                    />
                </div>
                <div style={{ paddingLeft: 40, marginTop: 10, fontFamily: "Itim", fontSize: 18, color: statusConsole === 'Script completed' ? '#a1cb6a' : '#f1c241' }}> Console:    {statusConsole}</div>

                <pre style={{ paddingLeft: 30 }}> {output} </pre>
            </div >
        );
    };



    function setCodeDescription(value) {
        setRunScript(false);
        setDescription(value);
    }

    function createPowerShellScript(title, code, description) {
        const data = {
            scriptName: title,
            scriptValue: code,
            scriptDescription: description,
            scriptFolder: selectedFolder
        };
        setScriptChanged(false)
        setRunScript(false);

        fetch(process.env.REACT_APP_API_URL + '/pscreate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    console.log('PowerShell script created successfully');
                } else {
                    console.error('Error creating PowerShell script');
                }
            })
            .catch(error => {
                console.error('Error creating PowerShell script', error);
            });
    }

    const [expanded, setExpanded] = useState(false);


    const [scriptexpanded, setScriptExpanded] = useState(false);

    function toggleScriptExpanded() {
        setRunScript(false)
        setExpanded(true)
        setScriptExpanded(expanded => !expanded);
    }

    function discardChanges() {
        setCode(value);
        setDescription(desc);
        setScriptTitle(title);
        setScriptChanged(false)
    }

    function setCodeValue(value) {
        setRunScript(false);
        const firstLine = value.split("\n")[0];
        if (firstLine.includes("$Parameter1")) {
            setParam1Active(true);
            const paramValue = firstLine.split("=")[1]?.trim();
            if (paramValue) {
                setParam1(paramValue);
            }
        } else {
            setParam1Active(false);
        }

        setCode(value);
    }
    // Parameter 1
    const [param1, setParam1] = useState('');
    const [param1Name, setParam1Name] = useState('');
    const [param1Changed, setParam1Changed] = useState(false);
    const [param1Active, setParam1Active] = useState(false);


    function OnParam1Change(e) {
        setRunScript(false);
        const newValue = e.target.value;
        setParam1(newValue);
        setParam1Changed(true);
    }

    useEffect(() => {
        try {
            const firstLine = code.split("\n")[0];
            const secondLine = code.split("\n")[1];

            let check = 0
            if (firstLine.includes("$ParamName1")) {
                const paramValue = firstLine.split("=")[1]?.trim();
                if (paramValue) {
                    check++
                    setParam1Name(paramValue);
                }
            }
            if (secondLine.includes("$Parameter1")) {

                const paramValue = secondLine.split("=")[1]?.trim();
                if (paramValue) {
                    check++
                    setParam1(paramValue);
                }
            }
            if (check === 2) {
                setParam1Active(true);
            }
        }
        catch (error) {
        }
    }, [code]);

    useEffect(() => {
        if (param1Changed) {
            const lines = code.split("\n");
            if (lines[1].includes("$Parameter1")) {
                lines[1] = `$Parameter1 = ${param1}`;
                setCode(lines.join("\n"));
            }
            setParam1Changed(false);
        }
    }, [param1Changed, code, param1]);
    // End Parameter 1

    // Parameter 2
    const [param2, setParam2] = useState('');
    const [param2Name, setParam2Name] = useState('');
    const [param2Changed, setParam2Changed] = useState(false);
    const [param2Active, setParam2Active] = useState(false);

    function OnParam2Change(e) {
        setRunScript(false);
        const newValue = e.target.value;
        setParam2(newValue);
        setParam2Changed(true);
    }
    useEffect(() => {
        try {
            const firstLine = code.split("\n")[2];
            const secondLine = code.split("\n")[3];

            let check = 0
            if (firstLine.includes("$ParamName2")) {
                const paramValue = firstLine.split("=")[1]?.trim();
                if (paramValue) {
                    check++
                    setParam2Name(paramValue);
                }

            }
            if (secondLine.includes("$Parameter2")) {

                const paramValue = secondLine.split("=")[1]?.trim();
                if (paramValue) {
                    check++
                    setParam2(paramValue);
                }
            }
            if (check === 2) {
                setParam2Active(true);
            }
            else {
                setParam2Active(false);
            }
        }
        catch (error) {
        }
    }, [code]);

    useEffect(() => {
        if (param2Changed) {
            const lines = code.split("\n");
            if (lines[3].includes("$Parameter2")) {
                lines[3] = `$Parameter2 = ${param2}`;
                setCode(lines.join("\n"));
            }
            setParam2Changed(false);
        }
    }, [param2Changed, code, param2]);
    // End Parameter 2


    return (
        <div className='TileContainer '  >
            <div className='TileMainTitleContainer' >
                <div style={{ display: "flex", flexDirection: "row" }} >
                    <BiPlayCircle className="IconButtonsScript" style={{ color: '#a1cb6a', margin: 5, maxHeight: 30 }} onClick={handleRunScript} />
                    {!scriptexpanded && <div className='ScriptInputField1'  > {title}</div>}
                    {scriptexpanded && <input defaultValue={title} type="text" placeholder="ScriptName" className='ScriptInputField1' onChange={(e) => setScriptTitle(e.target.value)} />}

                    <div className='ParamContent'>

                        {param1Active && <div style={{ display: "flex", height: 20 }}>
                            <div style={{ fontSize: 13, margin: "auto" }} > {param1Name.trim().replace(/^'|'$/g, '')}:</div>
                            < input
                                type="text"
                                name="title"
                                placeholder="Param 1"
                                value={param1}
                                onChange={OnParam1Change}
                                style={{
                                    background: 'transparent',
                                    fontSize: 13,
                                    overflow: 'hidden',
                                    color: 'white',
                                    width: 100,

                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    paddingLeft: 5,

                                    marginLeft: 10,
                                }}
                            />
                        </div>}

                        {param2Active && <div style={{ display: "flex", height: 20, marginLeft: 20 }}>
                            <div style={{ fontSize: 13, margin: "auto" }} > {param2Name.trim().replace(/^'|'$/g, '')}:</div>
                            < input
                                type="text"
                                name="title"
                                placeholder="Param 2"
                                value={param2}
                                onChange={OnParam2Change}
                                style={{
                                    background: 'transparent',
                                    fontSize: 13,
                                    overflow: 'hidden',
                                    color: 'white',
                                    width: 100,

                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    paddingLeft: 5,

                                    marginLeft: 10,
                                }}
                            />
                        </div>}
                    </div>

                    <div className="ScriptButtonsGroup2">

                        <BiEditAlt
                            className="IconButtonsScript"
                            style={{ fontSize: 25, color: '#d8d3c4', margin: 'auto', marginRight: 10, }}
                            onClick={() => toggleScriptExpanded()}
                        />

                        <BiDownload
                            className='IconButtonsScript'
                            style={{ fontSize: 25, color: '#d8d3c4', margin: 'auto', marginRight: 10 }}
                            onClick={handleDownloadScript}
                        />
                    </div>
                </div>

                {expanded && <div  >

                    {scriptexpanded && <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <select
                            style={{
                                color: "#d8d3c4",
                                background: 'transparent',
                                fontSize: 16,
                                fontFamily: 'Itim',
                                marginLeft: 10,
                                width: "100%",
                                marginRight: 10,
                            }}
                            onChange={handleSelectFolder}
                            value={selectedFolder}
                        >
                            {folders.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>

                        {scriptChanged && <BiSave
                            className="IconButtonsScript"
                            style={{ fontSize: 25, color: '#a1cb6a', margin: 'auto', marginRight: 10, }}
                            onClick={() => createPowerShellScript(scriptTitle, code, description)}
                        />}
                        {scriptChanged && <FaUndo
                            className="IconButtonsScript"
                            style={{ fontSize: 20, color: '#c45d34', margin: 'auto', marginRight: 10, }}
                            onClick={() => discardChanges()}
                        />}
                        <BiTrash
                            className="IconButtonsScript"
                            style={{ fontSize: 25, color: '#c45d34', margin: 'auto', marginRight: 10, }}
                            onClick={() => onDelete(scriptTitle)}
                        />
                    </div>}

                    {scriptexpanded && <div
                        role="button"
                        tabIndex={0}
                        className='TileEditor'
                        onKeyDown={() => textareaRef.current?.focus()}
                        onClick={() => textareaRef.current?.focus()}
                        style={{ position: 'relative', flex: '1', overflow: 'hidden', marginBottom: 10, borderStyle: 'none', paddingTop: 10 }}
                    >



                        <div style={{ color: "#d8d3c4", paddingLeft: 40, marginTop: 5, fontFamily: "Itim", fontSize: 18 }}>   Description </div>
                        <textarea
                            style={{
                                inset: 0,
                                resize: 'none',
                                color: '#d8d3c4',
                                background: 'transparent',
                                outline: 'none',
                                fontSize: 16,
                                overflow: 'hidden',
                                borderStyle: 'none',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                fontFamily: 'Itim',
                                paddingLeft: 40,
                                paddingTop: 10,
                            }}
                            value={description}
                            onChange={(e) => setCodeDescription(e.target.value)}
                        />

                    </div>}
                    {scriptexpanded && <div
                        role="button"
                        tabIndex={0}
                        className='TileEditor'
                        onKeyDown={() => textareaRef.current?.focus()}
                        onClick={() => textareaRef.current?.focus()}
                        style={{ position: 'relative', flex: '1', overflow: 'hidden', marginBottom: 10, borderStyle: 'none' }}
                    >
                        <LineNumbers lines={numLines} />
                        <div style={{ position: "absolute", color: "#d8d3c4", paddingLeft: 40, marginTop: 10, fontFamily: "Itim", fontSize: 18 }}>  Script </div>
                        <textarea
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'transparent',
                                margin: 0,
                                color: 'transparent',
                                caretColor: 'white',
                                outline: 'none',
                                fontSize: 16,
                                overflow: 'hidden',
                                borderStyle: 'none',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                fontFamily: 'monospace',
                                paddingLeft: 40,
                                paddingTop: 38,
                                paddingBottom: 10,
                                paddingRight: 10,
                                marginBottom: 10,
                            }}
                            value={code}
                            onChange={(e) => setCodeValue(e.target.value)}
                        />


                        <SyntaxHighlighter
                            language="powershell"
                            style={atomOneDark}
                            customStyle={{
                                inset: 0,
                                background: 'transparent',
                                fontFamily: 'monospace',
                                fontSize: 16,
                                margin: 0,
                                width: '100%',
                                overflow: 'hidden',
                                paddingLeft: 40,
                                paddingTop: 38,
                                paddingBottom: 10,
                                paddingRight: 10,
                                marginBottom: 10,
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>


                    </div>}
                    {showConsole && <StreamResponse input={code} />}

                </div>}
            </div>
        </div>
    );
}
export default ScriptModule;