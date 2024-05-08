import axios from 'axios';
axios.get('https://primozhrastar.si')
    .then(response => {
    console.log(response.data);
})
    .catch(error => {
    console.error(error);
});
//# sourceMappingURL=axi.js.map