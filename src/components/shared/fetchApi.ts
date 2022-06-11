import axios from 'axios'

axios.defaults.baseURL = 'https://api.themoviedb.org/3'

const API_KEY = 'f62f750b70a8ef11dad44670cfb6aa57';

export default {
    /**
     * General HTTP Get Method
     * @param url
     * @param data
     * @param options
     */
    getMethod (url: string, data = {params: {}}, options?: { property: string; value: string }[]) {
        let destUrl = `${url}?api_key=${API_KEY}&language=en-US`;
        if (options) {
            for (const item of options) {
                destUrl += `&${item.property}=${item.value}`

            }
        }
        return axios.get(destUrl, data)
            .then(response => {
                return response.data
            })
    },
}
