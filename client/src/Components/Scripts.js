import React, { useEffect, useState, useCallback } from 'react';
import ScriptModule from './ScriptModule';
import { FaPlusCircle } from 'react-icons/fa';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

function Scripts() {
    const [scriptsData, setScriptsData] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [selectedFolder, setSelectedFolder] = useState('');
    const [newScriptName, setNewScriptName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [isDuplicateScriptName, setIsDuplicateScriptName] = useState(false);
    const [newScriptExtended, setNewScriptExtended] = useState(false);
    const [selectedExpandedFolder, setSelectedExpandedFolder] = useState('');
    const MemoizedScriptModule = React.memo(ScriptModule);

    function toggleNewScriptExpanded() {
        setNewScriptExtended(expanded => !expanded);
    }

    const retrieveScripts = () => {
        fetch(process.env.REACT_APP_API_URL + '/scripts', {
            headers: {
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
        })
            .then(response => response.json())
            .then(setScriptsData)
            .catch(console.error);
    };

    const handleNewScriptSubmit = () => {
        const newScript = {
            scriptName: newScriptName,
            scriptFolder: selectedFolder || scriptsData[0].scriptFolder,
            scriptDescription: 'New script',
            scriptValue: `$ParamName1 = 'Par1'\n$Parameter1 = 'Var1'\n$ParamName2 = 'Par2'\n$Parameter2 = 'Var2'\n\nWrite-Host $Parameter1 $Parameter2`,
        };
        fetch(process.env.REACT_APP_API_URL + '/pscreate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify(newScript),
        })
            .then(response => response.json())
            .then(data => {
                setScriptsData(prevScriptsData => [...prevScriptsData, data]);
                setNewScriptName('');
                setNewFolderName('');
                setSelectedFolder(data.scriptFolder);
            })
            .catch(console.error);
    };

    const handleNewScriptChange = useCallback(
        event => {
            const newScriptNameValue = event.target.value;
            setNewScriptName(newScriptNameValue);
            setIsDuplicateScriptName(
                scriptsData.some(script => script.scriptName === newScriptNameValue)
            );
        },
        [scriptsData]
    );

    const handleNewFolderChange = useCallback(
        event => {
            const newFolderNameValue = event.target.value;
            setNewFolderName(newFolderNameValue);
            setSelectedFolder(newFolderNameValue);
        },
        []
    );

    const handleSelectedFolderChange = useCallback(event => {
        const folderName = event.target.value;
        setSelectedExpandedFolder(folderName);
        setSelectedFolder(folderName);
    }, []);

    const toggleFolder = folderName => {
        setSelectedExpandedFolder(folderName);
    };

    const handleDeleteScript = scriptName => {
        console.log('handleDeleteScript');
        fetch(process.env.REACT_APP_API_URL + '/script', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY,
            },
            body: JSON.stringify({ scriptName: scriptName }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.data === 'deleted') {
                    console.log('Successfully Deleted Script', scriptName);
                    setScriptsData(prevScriptsData =>
                        prevScriptsData.filter(script => script.scriptName !== scriptName)
                    );
                } else {
                    throw new Error(data);
                }
            })
            .catch(console.error);
    };

    useEffect(() => retrieveScripts(), []);
    useEffect(() => {
        if (!Object.keys(expandedFolders).length && scriptsData.length) {
            setExpandedFolders({ [scriptsData[0].scriptFolder]: true });
        }
    }, [expandedFolders, scriptsData]);

    const scriptsByFolder = scriptsData.reduce((folders, script) => {
        if (script.scriptFolder !== 'DELETED') {
            (folders[script.scriptFolder] = folders[script.scriptFolder] || []).push(
                script
            );
        }
        return folders;
    }, {});

    const folderNames = Object.keys(scriptsByFolder).filter(
        folderName => folderName !== 'DELETED'
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="CategoryContainer">
                {folderNames.map(folderName => (
                    <div
                        key={folderName}
                        className={`TitleButton ${selectedExpandedFolder === folderName ? 'TitleButton-active' : ''
                            }`}
                        onClick={() => toggleFolder(folderName)}
                    >
                        {folderName}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {Object.entries(scriptsByFolder).map(([folderName, scripts]) => (
                    <div key={folderName}>
                        {selectedExpandedFolder === folderName &&
                            scripts.map(script => (
                                <MemoizedScriptModule
                                    key={script.scriptName}
                                    title={script.scriptName}
                                    value={script.scriptValue}
                                    folderName={script.scriptFolder}
                                    desc={script.scriptDescription}
                                    folders={folderNames}
                                    onDelete={handleDeleteScript}
                                />
                            ))}
                    </div>
                ))}

                {!newScriptExtended && (
                    <BsFileEarmarkPlus
                        onClick={toggleNewScriptExpanded}
                        style={{
                            color: '#a1cb6a',
                            fontSize: 35,
                            paddingTop: 5,
                            paddingRight: 10,
                            margin: 'auto',
                            marginTop: 30,
                        }}
                    />
                )}
                {newScriptExtended && (
                    <ImCancelCircle
                        onClick={toggleNewScriptExpanded}
                        style={{
                            color: '#c45d34',
                            fontSize: 35,
                            paddingTop: 5,
                            paddingRight: 10,
                            margin: 'auto',
                            marginTop: 30,
                        }}
                    />
                )}

                {newScriptExtended && (
                    <div style={{}}>
                        <div className="CreateInputField" style={{ marginTop: 30 }}>
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Script Name"
                                    value={newScriptName}
                                    onChange={handleNewScriptChange}
                                    style={{
                                        background: 'transparent',
                                        outline: 'none',
                                        fontSize: 16,
                                        overflow: 'hidden',
                                        borderStyle: 'none',
                                        color: 'white',
                                        width: 270,
                                        height: '100%',
                                    }}
                                />
                            </div>
                            <div>
                                {newScriptName !== '' && !isDuplicateScriptName && (
                                    <FaPlusCircle
                                        onClick={handleNewScriptSubmit}
                                        style={{
                                            color: '#a1cb6a',
                                            fontSize: 25,
                                            paddingTop: 5,
                                            paddingRight: 10,
                                        }}
                                    ></FaPlusCircle>
                                )}
                                {(newScriptName === '' || isDuplicateScriptName) && (
                                    <FaPlusCircle
                                        style={{
                                            color: '#d8d3c4',
                                            fontSize: 25,
                                            paddingTop: 5,
                                            paddingRight: 10,
                                        }}
                                    ></FaPlusCircle>
                                )}
                            </div>
                        </div>
                        {newFolderName === '' && (
                            <div className="CreateInputField" style={{ marginTop: 10 }}>
                                <div>
                                    <select
                                        name="folderSelect"
                                        value={selectedFolder}
                                        onChange={handleSelectedFolderChange}
                                        style={{
                                            display: 'flex',
                                            background: 'transparent',
                                            outline: 'none',
                                            fontSize: 16,
                                            overflow: 'hidden',
                                            borderStyle: 'none',
                                            color: 'white',
                                            width: 295,
                                            height: '100%',
                                        }}
                                    >
                                        {folderNames.map((folder, index) => (
                                            <option key={index} value={folder}>
                                                {folder}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="CreateInputField" style={{ marginTop: 10 }}>
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="New Folder"
                                    value={newFolderName}
                                    onChange={handleNewFolderChange}
                                    style={{
                                        background: 'transparent',
                                        outline: 'none',
                                        fontSize: 16,
                                        overflow: 'hidden',
                                        borderStyle: 'none',
                                        color: 'white',
                                        width: 270,
                                        height: '100%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Scripts;
