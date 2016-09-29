export default function switchStat() {
    var someString = 'oy';
    var result = '';
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
