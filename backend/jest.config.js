export default {
    testEnvironment: "node",

    extensionsToTreatAsEsm: [".ts"],

    transform: {
        "^.+\\.(t|j)sx?$": [
            "@swc/jest",
            {
                jsc: {
                    parser: {
                        syntax: "typescript"
                    },
                    target: "es2022"
                },
                module: {
                    type: "es6"
                }
            }
        ]
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
}