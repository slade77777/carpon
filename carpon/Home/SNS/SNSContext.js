import React, {createContext, useState, useContext, PureComponent} from 'react'

const SNSContext = createContext(null);

export default function SNSContextProvider({children, defaultFocusedTab = 0, defaultMainTabIndex = 0}) {
    const [tabIndex, focusTab] = useState(defaultFocusedTab);
    const [mainTabIndex, setMainTabIndex] = useState(defaultMainTabIndex);
    const [TagKeyword, setTagKeyword] = useState('');

    return (
        <SNSContext.Provider value={[{tabIndex, TagKeyword, mainTabIndex}, {focusTab, setTagKeyword, setMainTabIndex}]}>
            {children}
        </SNSContext.Provider>
    )
}

export const useSNSContext = () => useContext(SNSContext);


export const SNSNavTab = () => (Target) => {

    return class extends PureComponent {

        render() {

            return <SNSContext.Consumer>
                {(value) => <Target {...this.props} tabNavigator={value}/>}
            </SNSContext.Consumer>
        }
    }
};
