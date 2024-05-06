import { useEffect, useState } from "react";
import { jpBooksExample } from "../../utils/json-examples";
import { MonacoEditor } from "../monaco-editor/monaco-editor"

export const JsonpathViewer = () => {
    const NUMBER_PATTERN = /^(\d+)(]){0,1}$/;

    const [value, setValue] = useState<any>(jpBooksExample);
    const [line, setLine] = useState<number>(0);
    const [jsonPath, setJsonPath] = useState<string>("");
    const [jsonPaths, setJsonPaths] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>();
    const [result, setResult] = useState<any>();

    const getFilters = (jsonPath: string): string[] => {
        let filters: string[] = [];
        let jpNodes = jsonPath.split('][');
        for (let i = 0; i < jpNodes.length; i++) {
            if (jpNodes[i].match(NUMBER_PATTERN)) {
                if (i - 1 > 0) {
                    filters.push(jpNodes[i - 1]);
                } else {
                    filters.push("array");
                }
            }
        }
        return filters;
    }

    const handleApplyFilter = (parentNode: string) => {
        let jpNodes = jsonPath.split("][");
        console.log(jpNodes)
        for (let i = 0; i < jpNodes.length; i++) {
            if (jpNodes[i] === parentNode) {
                if (i + 1 < jpNodes.length) {
                    let filterNode = "";
                    // if ..[0][field]
                    if (i + 2 < jpNodes.length) {
                        filterNode = jpNodes[i + 2].replaceAll("'", "").replaceAll("]", "");
                    } else { // ..[0]
                        let node = getJpValue(value, jsonPath);
                        filterNode = Object.keys(node[0])[0];
                    }
                    if (jpNodes[i + 1].charAt(jpNodes[i + 1].length - 1) === ']') {
                        jpNodes[i + 1] = `?(@.${filterNode})]`;
                    } else {
                        jpNodes[i + 1] = `?(@.${filterNode})`;
                    }
                    break;
                }
            }
        }
        let jpNodesWithFilter = jpNodes.join("][");
        setJsonPath(jpNodesWithFilter);
    }

    const ammendPath = (key: string, ref: string) => {
        if (key.match(NUMBER_PATTERN)) {
            return ref += "[" + key + "]";
        } else {
            return ref += "['" + key + "']";
        }
    }

    const buildJsonPaths = (
        json: any,
        path: string,
        paths: any[],
        count: number
    ) => {
        for (let key in json) {
            let pathAmmended = path;
            if (json[key] && typeof json[key] === "object") {
                pathAmmended = ammendPath(key, pathAmmended);
                paths.push(pathAmmended);
                if (Object.keys(json[key]).length > 0 ||
                    (Array.isArray(json[key]) && json[key].length > 0)) {
                    buildJsonPaths(json[key], pathAmmended, paths, count + 1);
                }
            } else {
                pathAmmended = ammendPath(key, pathAmmended);
                paths.push(pathAmmended);
            }
        }
        paths.push("");
    }

    const getJpValue = (value: any, jsonPath: string) => {
        try {
            const jp = require('jsonpath');
            return jp.query(value, jsonPath);
        } catch (error) {
            console.error("Jp error: ", error);
            return null;
        }
    }

    useEffect(() => {
        if (value) {
            let paths: string[] = [];
            buildJsonPaths(value, "$", paths, 0);
            setJsonPaths(paths);
        }
    }, [value])

    useEffect(() => {
        if (line && jsonPaths && value) {
            let jsonPath = jsonPaths[line - 2];
            setJsonPath(jsonPath);
        }
    }, [line])

    useEffect(() => {
        if (jsonPath && jsonPath !== "") {
            let filters = getFilters(jsonPath);
            setFilters(filters);

            let result = getJpValue(value, jsonPath);
            if (result) {
                setResult(result);
            }
        }
    }, [jsonPath])

    return (
        <div style={{
            display: "flex",
            justifyItems: "left",
            width: "100%"
        }}>
            <div style={{
                padding: "40px",
                paddingTop: "20px",

                margin: "auto",
                width: "100%"
            }}>
                <h1 style={{
                    marginBottom: "20px"
                }}>
                    JsonPath UI
                </h1>
                <div style={{
                    display: "flex",
                    marginBottom: "5px"
                }}>
                    <p style={{
                        color: "blue",
                    }}>
                        {jsonPath ? jsonPath : "Click on a field to get the JsonPath."}
                    </p>
                    {
                        filters &&
                        filters.length > 0 &&
                        filters.map((f: string) => {
                            return (
                                <p style={{
                                    color: "blue",
                                    marginLeft: "10px",
                                    fontStyle: "italic",
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                }}
                                    onClick={() => handleApplyFilter(f)}
                                >
                                    filter {f}?
                                </p>
                            )
                        })
                    }
                </div>
                <div style={{
                    display: "flex",

                    width: "100%"
                }}>
                    <div style={{
                        width: "100%",
                        marginRight: "10px"
                    }}>
                        <MonacoEditor
                            value={value}
                            setValue={setValue}
                            setLine={setLine}
                        />
                    </div>
                    <div style={{
                        width: "100%",
                        marginLeft: "10px"
                    }}>
                        <MonacoEditor
                            value={result}
                            setValue={() => undefined}
                            setLine={() => undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}