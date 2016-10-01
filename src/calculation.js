import switchStat from './switchStat';

export default function calculation() {
    const one = 1;
    const two = 2;
    let total = one + two;
    if (total === 4) {
        total = 5;
    }


    return total + switchStat();
}
