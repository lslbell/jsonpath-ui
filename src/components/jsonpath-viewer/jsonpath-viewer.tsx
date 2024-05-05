import { useEffect, useState } from "react";
import { jsonExample } from "../../utils/json-examples";
import { MonacoEditor } from "../monaco-editor/monaco-editor"

export const JsonpathViewer = () => {
    const [value, setValue] = useState<any>(jsonExample);
    const [line, setLine] = useState<number>(0);
    const [jsonPath, setJsonPath] = useState<string>("");
    const [jsonPaths, setJsonPaths] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>();

    const getFilters = () => {

    }

    const ammendPath = (key: string, ref: string) => {
        if (key.match(/^\d+$/)) {
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

    useEffect(() => {
        if (value) {
            let paths = [] as any;
            buildJsonPaths(value, "$", paths, 0);
            setJsonPaths(paths);
        }
    }, [value])

    useEffect(() => {
        if (line && jsonPaths) {
            let jsonPath = jsonPaths[line - 2];
            setJsonPath(jsonPath);
        }
    }, [line])

    return (
        <div style={{
            display: "flex",
            justifyItems: "center",
            width: "100%"
        }}>
            <div style={{
                padding: "40px",
                paddingTop: "20px",

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
                {
                    filters &&
                    filters.length > 0 &&
                    filters.map((f) => {
                        return (
                            <p style={{
                                color: "blue"
                            }}>
                                {f}
                            </p>
                        )
                    })
                }
                <MonacoEditor
                    value={value}
                    setValue={setValue}
                    setLine={setLine}
                />
            </div>
        </div>
    )
}