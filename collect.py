import os
import pathlib

def collect_files(directory, output_file, skip_folders=None, skip_files=None):
    if skip_folders is None:
        skip_folders = []
    if skip_files is None:
        skip_files = []
    
    # Получаем абсолютный путь к директории
    base_dir = os.path.abspath(directory)
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(directory):
            # Модифицируем список dirs на месте, чтобы os.walk пропускал нежелательные папки
            dirs[:] = [d for d in dirs if d not in skip_folders]
            
            for file in files:
                # Пропускаем выходной файл и файлы из списка skip_files
                if file == os.path.basename(output_file) or file in skip_files:
                    continue
                    
                filepath = os.path.join(root, file)
                
                # Получаем относительный путь и заменяем обратные слеши на прямые
                rel_path = os.path.relpath(filepath, base_dir)
                rel_path_formatted = rel_path.replace(os.sep, '/')
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        outfile.write(f"// {rel_path_formatted}\n\n")
                        outfile.write(infile.read())
                        outfile.write("\n\n")
                except Exception as e:
                    outfile.write(f"// {rel_path_formatted} [Ошибка чтения: {str(e)}]\n\n")

# Пример использования
collect_files(
    "./", 
    "all_files.txt", 
    skip_folders=[".next", "node_modules", ".git"],
    skip_files=["package-lock.json"]
)



def generate_directory_tree(directory, output_file, skip_folders=None):
    if skip_folders is None:
        skip_folders = [".next", "node_modules"]
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        paths = []
        
        for root, dirs, files in os.walk(directory):
            # Пропускаем нежелательные папки
            dirs[:] = [d for d in dirs if d not in skip_folders]
            
            # Получаем относительный путь
            rel_path = os.path.relpath(root, directory)
            if rel_path == ".":
                # Обрабатываем корневые файлы
                for file in sorted(files):
                    paths.append(file)
            else:
                # Обрабатываем папки
                level = rel_path.count(os.sep)
                indent = '│   ' * level
                folder_name = os.path.basename(root)
                paths.append(f"{indent}├───{folder_name}")
                
                # Обрабатываем файлы внутри папок
                for file in sorted(files):
                    file_indent = '│   ' * (level + 1)
                    paths.append(f"{file_indent}{file}")
        
        # Записываем результат
        for i, path in enumerate(paths):
            if i < len(paths) - 1 and path and not path.endswith(('├───', '└───')):
                next_path = paths[i + 1]
                if next_path and ('├───' in next_path or '└───' in next_path):
                    outfile.write(f"{path}\n│       \n")
                else:
                    outfile.write(f"{path}\n")
            else:
                outfile.write(f"{path}\n")

# Пример использования
generate_directory_tree("./", "structure.txt", [".next", "node_modules", ".git"])