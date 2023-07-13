const readline = require('readline');
const fs = require('fs');
const {seekSync} = require('fs-ext');

async function find_max(line_stream){
    let max_str = "";
    for await (const line of line_stream) {
        if (line > max_str){
            max_str = line;
        }
    }
    return max_str;
}

async function absolute_min(line_stream, fd){
    let count = 0;  // количество минимумов
    let lines_num = 0;  // общее количество строк в файле
    let min_str = await find_max(line_stream);
    seekSync(fd, 0, 0);
    for await (const line of line_stream) {
        console.log(line);
        lines_num++;
        if (line === min_str){
            count++;
        }
        else if (line < min_str){
            min_str = line;
            count = 1;
        }
    }
    return {"min": min_str, "count": count, "lines_num": lines_num};
}

async function min_with_limit(line_stream, fd, limit){
    let count = 0;
    let min_str = await find_max(line_stream);
    seekSync(fd, 0, 0);
    for await (const line of line_stream) {
        if (line === min_str){
            count++;
        }
        else if (min_str > line && line > limit){
            min_str = line;
            count = 1;
        }
    }
    return {"min": min_str, "count": count};
}

async function sort_file(filename){
    const fd = fs.openSync(filename, 'r')
    const file_stream = fs.createReadStream(filename);
    const line_stream = readline.createInterface({
        input: file_stream,
        crlfDelay: Infinity
    });
    let {min_str, count, lines_num} = await absolute_min(line_stream, fd);
    let limit = min_str;  // нижняя граница
    for (let i = 0; i < count; i++){
        fs.appendFile("result.txt", min_str, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
        console.log(min_str);
    }
    let k = 0;
    let repeat = lines_num - count;  // количество итераций для сортировки всего файла
    while (k < repeat){
        seekSync(fd, 0, 0);
        let {min_str, count} = await min_with_limit(line_stream, fd, limit)
        limit = min_str;
        for (let i = 0; i < count; i++){
            fs.appendFile("result.txt", min_str, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            console.log(min_str);
        }
        k += count;
    }
    fs.close(fd);
}

const readline_sync = require('readline-sync');
const filename = readline_sync.question("Enter filename: ");
sort_file(filename);