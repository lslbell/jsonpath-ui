import { Editor } from "@monaco-editor/react"
import { Dispatch, SetStateAction } from "react"

export const MonacoEditor = (props: {
    value: any,
    setValue: Dispatch<SetStateAction<any>>,
    setLine: Dispatch<SetStateAction<number>>,
}) => {

    const handleOnMount = (editor: any, monaco: any) => {
        try {
            editor.onDidChangeCursorPosition((e: any) => handleMouseDown(e));
        } catch (error) {
            console.error("Error mounting editor: ", error);
        }
    }

    const handleMouseDown = (e: any) => {
        const line = e.position?.lineNumber;
        if (line) {
            props.setLine(line);
        }
    }

    const handleChange = (value: any, e: any) => {
        try {
            let jsonData = JSON.parse(value);
            props.setValue(jsonData);
        } catch (error) {
            console.error("Failed to parse JSON: ", error);
        }
    }

    return (
        <div style={{
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "gray",
            borderRadius: "10px",

            paddingBottom: "7px"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",

                borderBottomWidth: "2px",
                borderBottomStyle: "solid",
                borderBottomColor: "gray",

                backgroundColor: "#f6f6f6",

                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
            }}>
                <p style={{
                    marginLeft: "20px",
                }}>
                    JSON
                </p>
            </div>
            <div style={{
                padding: "3px"
            }}>
                <Editor
                    language="json"
                    theme="vs-light"
                    height="65vh"
                    value={JSON.stringify(props.value, null, 2)}
                    onChange={handleChange}
                    onMount={handleOnMount}
                    options={{
                        minimap: {
                            enabled: false
                        }
                    }}
                />
            </div>
        </div>
    )
}