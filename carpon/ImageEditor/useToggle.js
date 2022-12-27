import {useState} from "react";

export default function useToggle(primary = true, secondary = false) {
    const [value, setValue] = useState(primary);

    const toggle = () => {
        setValue((current) => {
            if (current === primary) {
                return secondary
            }

            return primary
        })
    }

    return [value, toggle]
}
