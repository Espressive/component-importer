import * as ts from "typescript"
import path from "path"
import { ComponentInfo, ProcessedFile } from "./types"
import { ComponentFinder, ResultType } from "./ts/types"
import { classComponentFinder } from "./ts/classComponentFinder"
import { functionComponentFinder } from "./ts/functionComponentFinder"
import { referenceComponentFinder } from "./ts/referenceComponentFinder"
import { exportTypeFinder } from "./ts/exportTypeFinder"
import { exportStarFinder } from "./ts/exportStarFinder"
import glob from "glob"
import { flatMap } from "./utils"

export async function analyzeTypeScript(files: string[], tsConfigPath?: string): Promise<ProcessedFile[]> {
    const processed: ProcessedFile[] = files.map(t => ({
        components: [],
        srcFile: t,
    }))

    const defaultConfig: ts.CompilerOptions = {
        //rootDir: dir,
        target: ts.ScriptTarget.ESNext,
        jsx: ts.JsxEmit.React,
        typeRoots: [],
    }

    const patterns = files.map(file => {
        const dir = path.dirname(file)
        return path.join(dir, "**/*.{tsx,ts,js,jsx, d.ts}")
    })
    const rootNames = flatMap(patterns, pattern => glob.sync(pattern))

    const program = ts.createProgram({
        options: tsConfigPath ? parseTsConfig(tsConfigPath) : defaultConfig,
        rootNames,
    })

    console.log("Source Files Founds:", program.getSourceFiles().length)
    program.getTypeChecker() // to make sure the parent nodes are set
    for (const file of processed) {
        const sourceFile = program.getSourceFile(file.srcFile)
        if (!sourceFile) throw new Error(`File ${file.srcFile} not found.`)
        console.log("SOURCE FILE", sourceFile.fileName)
        await analyze(sourceFile, file, program)
    }
    return processed
}

function analyze(sourceFile: ts.SourceFile, processedFile: ProcessedFile, program: ts.Program) {
    processedFile.components = Array.from(findComponents(sourceFile, program))
}

function* findComponents(sourceFile: ts.SourceFile, program: ts.Program): IterableIterator<ComponentInfo> {
    const componentFinders: ComponentFinder[] = [
        classComponentFinder,
        functionComponentFinder,
        referenceComponentFinder,
        exportTypeFinder,
        exportStarFinder,
    ]

    const remainingStatements = Array.from(sourceFile.statements)

    for (const node of remainingStatements) {
        for (const componentFinder of componentFinders) {
            for (const comp of componentFinder.extract(node, program)) {
                if (comp.type === ResultType.ComponentInfo) {
                    yield comp.componentInfo
                }
                if (comp.type === ResultType.SourceFile) {
                    remainingStatements.push(...comp.sourceFile.statements)
                }
            }
        }
    }
}

function parseTsConfig(tsConfigPath: string): ts.CompilerOptions {
    const { error, config } = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
    if (error) {
        throw new Error(`Unable to find tsconfig.json under ${tsConfigPath}`)
    }
    return config
}
