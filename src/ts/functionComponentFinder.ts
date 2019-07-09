import ts from "typescript"
import { ComponentFinder, ComponentFinderResult, ResultType } from "./types"
import { getFirstGenericArgument, toTypeInfo, isExported } from "./utils"
import { flatMap } from "../utils"

/**
 * A ComponentFinder for function components
 */
export const functionComponentFinder: ComponentFinder = {
    extract(node: ts.Statement, program: ts.Program): ComponentFinderResult[] {
        if (!ts.isVariableStatement(node)) return []
        if (!isExported(node)) return []
        if (!node.declarationList.declarations) return []

        return flatMap(node.declarationList.declarations, decl => {
            if (!decl) return []

            const name = (decl.name as ts.Identifier).text
            const typeNode = decl.type
            if (!typeNode) return []

            const checker = program.getTypeChecker()

            const type = checker.getTypeFromTypeNode(getFirstGenericArgument(decl.type))
            return [
                {
                    type: ResultType.ComponentInfo,
                    componentInfo: {
                        name,
                        propsTypeInfo: toTypeInfo(type, checker),
                    },
                },
            ]
        })
    },
}
