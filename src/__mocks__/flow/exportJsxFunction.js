// @flow

import * as React from "react"

type Props = {
    text: string,
    num: number,
    bool: boolean,
    fancyColor: string,
}

export function SimpleReactComponent(props: Props) {
    return <p>{props.text}</p>
}

SimpleReactComponent.defaultProps = {
    text: "Placeholder",
    num: 42,
    bool: true,
    fancyColor: "#0099ff",
}
