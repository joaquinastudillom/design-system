const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const { pathToFileURL } = require("url");

const getComponents = () => {
    let allComponents = [];
    const types = ["atoms", "molecules", "organisms"];

    types.forEach(type => {
        const allFiles = fs.readdirSync(`src/${type}`).map(file => {
            return {
                input: `src/${type}/${file}`,
                output: `src/lib/${file.slice(0, -4)}css`
            }
        });
        allComponents = [...allComponents, ...allFiles];
    });

    return allComponents;
};

const compile = (pathName, fileName) => {
    const result = sass.renderSync({
        data: fs.readFileSync(path.resolve(pathName)).toString(),
        outputStyle: "expanded",
        outFile: "global.css",
        includePaths: [path.resolve("src")]
    });

    fs.writeFileSync(path.resolve(fileName), result.css.toString());
};

compile("src/global.scss", "src/lib/global.css");

getComponents().forEach(component => {
    compile(component.input, component.output);
});