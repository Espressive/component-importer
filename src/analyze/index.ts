import {
    findDefaultIndex,
    defaultFlowIgnorePatterns,
    defaultFlowIncludePattern,
    findFilesAtImportPath,
    defaultPlainIgnorePatterns,
    defaultPlainIncludePattern,
} from "../utils"

import { analyzeTypeScript } from "./typescript"
export { analyzeTypeScript } from "./typescript"

import { analyzeFlowAndPlainJavaScript as analyzeFlow } from "./flow"
export { analyzeFlowAndPlainJavaScript as analyzeFlow } from "./flow"

import { analyzeFlowAndPlainJavaScript as analyzePlainJavaScript } from "./flow"
export { analyzeFlowAndPlainJavaScript as analyzePlainJavaScript } from "./flow"

type AnalyzeOpts = {
    // TODO: some of these might not be required
    importPath?: string
    mode?: "typescript" | "plain" | "flow"
    ignore?: string[]
    include?: string
    index?: string[]
    tsconfig?: string
    help?: boolean
    force: boolean
    out: string
    verbose?: boolean
}

export function analyze(opts: AnalyzeOpts) {
    if (opts.mode === "typescript") {
        const { tsconfig, importPath, index = findDefaultIndex(importPath) } = opts

        // Throw execption if index is not found

        return analyzeTypeScript(index, tsconfig)
    }

    if (opts.mode === "flow") {
        const { importPath, ignore = defaultFlowIgnorePatterns, include = defaultFlowIncludePattern, verbose } = opts
        const files = findFilesAtImportPath(importPath, include, ignore)

        return analyzeFlow(files, { verbose })
    }

    if (opts.mode === "plain") {
        const { importPath, ignore = defaultPlainIgnorePatterns, include = defaultPlainIncludePattern, verbose } = opts
        const files = findFilesAtImportPath(importPath, include, ignore)

        return analyzePlainJavaScript(files, { verbose })
    }
}
