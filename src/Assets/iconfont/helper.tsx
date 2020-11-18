import _ from 'lodash'

export function getIconColor(color: string | undefined, num: number, defaultColor: string):string {
    return _.isEmpty(color) ? defaultColor : color! 
}

