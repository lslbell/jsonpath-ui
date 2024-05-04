import { useEffect, useState } from "react";
import { jsonExample } from "../../utils/json-examples";
import { MonacoEditor } from "../monaco-editor/monaco-editor"

export const JsonpathViewer = () => {
    const [value, setValue] = useState<any>(jsonExample);
    const [line, setLine] = useState<number>(0);
    const [jsonPath, setJsonPath] = useState<string>("");

    const ammendPath = (key: string, ref: string) => {
        return ref += "['" + key + "']";
    }

    const buildJsonPathFromLine = (
        line: number,
        json: any,
        pathRef: string,
        paths: any[],
        count: number,
        countTarget: number
    ) => {
        for (let key in json) {
            let tempRef = pathRef;
            if (json[key] && typeof json[key] === "object") {
                tempRef = ammendPath(key, tempRef);
                paths.push(tempRef);
                if (Object.keys(json[key]).length > 0 ||
                    (Array.isArray(json[key]) && json[key].length > 0)) {
                    buildJsonPathFromLine(line, json[key], tempRef, paths, count + 1, countTarget);
                }
            } else {
                tempRef = ammendPath(key, tempRef);
                paths.push(tempRef);
            }
        }
        paths.push("");
    }

    const getJsonPath = (line: number, value: any) => {
        let paths = [] as any;
        buildJsonPathFromLine(line, value, "$", paths, 0, line);
        return paths[line - 2];
    }

    useEffect(() => {
        if (line && value) {
            let jsonPath = getJsonPath(line, value);
            setJsonPath(jsonPath);
        }
    }, [line, value])

    return (
        <div style={{
            display: "flex",
            justifyItems: "center",
            width: "100%"
        }}>
            <div style={{
                padding: "40px",
                margin: "auto",
                width: "50%"
            }}>
                <h1>
                    JsonPath UI
                </h1>
                <p style={{
                    color: "blue"
                }}>
                    JsonPath: {jsonPath ? jsonPath : "click on a field to get the JsonPath."}
                </p>

                <MonacoEditor
                    value={value}
                    setValue={setValue}
                    setLine={setLine}
                />
            </div>
        </div>
    )
}