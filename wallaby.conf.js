module.exports = function (wallaby) {

    return {
        localProjectDir: "tests",

        files: [
            '/**/*.[tj]s',
            '!/**/*.test.[tj]s',
            '!/node_modules/**/*.[tj]s',
            '!/api/node_modules/**/*.[tj]s',
        ],

        tests: [
            '/**/*.test.[tj]s',
            '/tests/*.test.[tj]s',
            '!/tests/acceptance/**/*.[tj]s',
            '!/node_modules/**/*.[tj]s',
            '!/api/node_modules/**/*.[tj]s',
        ],

        env: { type: 'node' },
        testFramework: 'jest',
    }
};