import axios, { AxiosInstance, AxiosResponse } from 'axios';

const beeApiClient = (): AxiosInstance => {
    return axios.create({
        baseURL: process.env.REACT_APP_BEE_HOST
    })
}

const beeDebugApiClient = (): AxiosInstance => {
    return axios.create({
        baseURL: process.env.REACT_APP_BEE_DEBUG_HOST
    })
}

interface File {
    id: String;
    file: BinaryType;
}

interface Peer {
    id: String;
    name: String;
}

export const beeApi = {
    files: {
        upload(file: File) {
            return beeApiClient().post(`/files`, file)
        },
        get(hash: String) {
            return beeApiClient().get<File>(`/files/${hash}`)
        }
    },
}

export const beeDebugApi = {
    status: {
        nodeHealth() {
            return beeDebugApiClient().get(`/health`)
        },
        nodeReadiness() {
            return beeDebugApiClient().get(`/readiness`)
        },
    },
    connectivity: {
        listPeers() {
            return beeDebugApiClient().get<Peer>(`/peers`)
        },
        blockListedPeers() {
            return beeDebugApiClient().get<Peer>(`/blocklist`)
        },
        topology() {
            return beeDebugApiClient().get<Peer>(`/topology`)
        }
    },
}