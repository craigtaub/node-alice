export default function switchStat() {
    const someString = 'oy';
    let result = '';
    switch(someString) {
        case 'o':
            result = 'bad code';
            break;
        case 'oy':
            result = 'correct code';
            break;
        default:
            result = 'another bad code';
    }


    return result;
}
