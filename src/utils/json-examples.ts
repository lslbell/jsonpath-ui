export const jsonExample = {
    "object": {
        "object": {
            "object": {
                "object": {
                    "field": ":)"
                }
            }
        }
    },
    "array": [
        {
            "boolean": true,
            "message": "hello",
            "number": -1
        },
        {
            "boolean": false,
            "message": "good morning",
            "number": 100
        },
        {
            "boolean": true,
            "message": "goodbye",
            "number": 3.14,
            "object": {
                "field": ":)"
            }
        }
    ]
}

export const jpExample = {
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.95
            }, {
                "category": "fiction",
                "author": "Evelyn Waugh",
                "title": "Sword of Honour",
                "price": 12.99
            }, {
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick",
                "isbn": "0-553-21311-3",
                "price": 8.99
            }, {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 22.99,
                "relatedBook": [
                    {
                        "category": "fiction",
                        "author": "J. R. R. Tolkien",
                        "title": "The Hobbit",
                        "isbn": "0-048-23188-6",
                        "price": 10.99,
                    }
                ]
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    }
}