export const GET_LIST_GAS_STATION = 'GET_LIST_GAS_STATION';

export function getListGasStations(range) {
    return {
        type: GET_LIST_GAS_STATION,
        range
    }
}
