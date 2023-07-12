def find_max(file):
    line = file.readline()
    max_str = line
    for line in file:
        if line > max_str:
            max_str = line
    return max_str


def absolute_min(file):
    count = 0  # количество минимумов
    lines_num = 0  # общее количество строк в файле
    min_str = find_max(file)
    file.seek(0)
    for line in file:
        lines_num += 1
        if line == min_str:
            count += 1
        elif line < min_str:
            min_str = line
            count = 1
    return min_str, count, lines_num


def min_with_limit(file, limit):
    count = 0
    min_str = find_max(file)
    file.seek(0)
    for line in file:
        if line == min_str:
            count += 1
        elif min_str > line > limit:
            min_str = line
            count = 1
    return min_str, count


def sort(filename):
    f_read = open(filename, "r")
    f_write = open("result.txt", "w")
    min_str, count, lines_num = absolute_min(f_read)
    limit = min_str  # нижняя граница
    for i in range(count):
        f_write.write(min_str)
    k = 0
    repeat = lines_num - count  # количество итераций для сортировки всего файла
    while k < repeat:
        f_read.seek(0)
        min_str, count = min_with_limit(f_read, limit)
        limit = min_str
        for i in range(count):
            f_write.write(min_str)
        k += count
    f_write.close()
    f_read.close()


if __name__ == '__main__':
    filename = input("Имя сортируемого файла: ")
    sort(filename)
