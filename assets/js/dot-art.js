// 도트아트 모음 기능

// 도트아트 데이터
const dotArtCategories = {
    'all': {
        name: '전체',
        arts: []
    },
    'animals': {
        name: '동물',
        arts: [
            `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡶⠶⢦⣄⠀⠀⠀⠀⠀⣴⠟⠛⢧⣠⣶⣿⠻⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⡟⠦⠌⠛⠉⠉⠉⢹⠇⢠⣶⣼⣷⣞⢙⣧⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣤⠃⠀⠀⠀⠀⠀⠀⣿⠀⠈⢻⡃⠀⢸⡿⡄⠈⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠀⠘⠷⠖⠛⠛⠛⢿⡗⢋⣴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⢻⡀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡶⠾⣷⠆⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡀⠀⠐⢺⡟⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⢿⡦⠀⠀⠛⠃⠀⠀⢠⢶⣄⠀⠀⠈⠛⠀⠀⠀⣺⠓⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣼⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⣖⡀⣀⣀⡀⠀⠈⠉⠉⠀⠀⣀⣀⣀⠀⣲⣯⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠶⡆
⢻⡈⠻⣦⣀⣀⣀⣀⣀⠀⠀⠀⠁⣴⠟⠉⠁⠀⠉⠛⢦⡀⢀⡴⠛⠉⠁⠈⠙⠻⣄⠀⠁⣀⣠⣤⣤⣤⣤⡤⠖⠋⣸⠇
⡿⠳⣤⣀⡀⠀⠀⠉⠉⠉⠳⢦⣼⠃⠀⠀⠀⠀⠀⠀⠀⠿⠋⠀⠀⠀⠀⠀⠀⠀⠹⣦⡞⠉⠀⠀⠀⠀⠀⢀⣠⠶⢻⡆
⠻⣦⣀⠀⠀⠀⡴⠶⢦⡀⠀⠈⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⡴⠚⠳⡄⠈⢉⣀⣠⡾⠁
⠀⠸⣍⣉⣁⡀⣇⠀⠀⠑⠀⢠⡿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢷⡀⠀⠓⠀⢀⡇⢤⣈⣭⠿⠁⠀
⠀⠀⠀⠙⠷⠤⠿⠶⠦⠶⠞⠋⠘⢻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠈⠻⠦⠴⠖⠻⠶⠶⠛⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⠻⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⣠⡴⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠶⣄⡀⢀⣤⠶⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
            `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⠖⠚⠉⠉⠀⠀⠀⠀⠉⠉⠙⠒⠤⣄⡀⠀⠀⣀⣠⣤⣀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠖⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢯⡀⠀⠀⠀⠉⠳⣄⠀
⠀⠀⣀⠤⠔⠒⠒⠒⠦⢤⣀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣄⠀⠀⠀⠀⠀⣴⢶⣄⠀⠀⠀⠉⢢⡀⠀⠀⠀⠘⡆
⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠈⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⢹⣧⠀⠀⠀⠀⣿⠀⢹⣇⠀⠀⠀⠀⠙⢦⠀⠀⠀⣧
⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣦⣼⣿⡇⠀⠀⠀⢿⣿⣿⣿⡄⠀⠀⠀⠀⠈⢳⡀⢀⡟
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡿⠿⠿⣿⠀⠀⠀⠘⣿⡛⣟⣧⠀⠀⠀⠀⠀⠀⢳⠞⠀
⢳⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡄⢴⡿⠀⠀⠀⠀⠘⣿⣷⡏⠀⢀⡠⠤⣄⠀⠀⣇⠀
⠀⢳⡀⠀⠀⠀⠀⠀⠀⢠⠏⠀⠀⠀⠀⠀⣠⠄⠀⠀⠀⠀⠀⠈⠛⠛⠁⣀⡤⠤⠤⠤⢌⣉⠀⠀⢠⡀⠀⠀⡱⠀⢸⡄
⠀⠀⠙⠦⣀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠸⣅⠀⠀⢀⡀⠀⠀⠀⢀⠴⠋⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠈⠉⠉⠀⠀⢘⣧
⠀⠀⠀⠀⠈⠙⢲⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠁⠀⠀⠀⣰⣋⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠈⢧⠀⠀⠀⠀⠀⢐⣿
⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠁⠀⠀⠀⠀⠀⠉⠙⠒⢤⣀⠀⠀⠈⣇⠀⠀⠀⠀⠀⣿
⠀⠀⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⢸⠀⠀⠀⠀⢠⡏
⠀⠀⠀⠀⠀⠀⠀⢳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠘⣧⠀⠀⠀⣸⠀
⠀⠀⠀⠀⠀⠀⠀⡟⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⢰⠏⠀⠀⢠⠇⠀
⠀⠀⠀⠀⠀⠀⢸⠁⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⣸⠀⠀⢀⠏⠀⠀
⠀⠀⠀⠀⠀⠀⣿⠀⠀⠘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⣣⠃⠀⣠⠏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠞⡱⠋⢀⡴⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠈⠣⣄⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⠀⠀⠀⢀⣀⡤⠖⢋⡠⠞⢁⡴⠋⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠀⠀⠀⠈⠙⠢⣄⡀⠀⠀⠀⠀⠈⠙⠯⠭⢉⠡⠤⠴⠒⣉⠴⠚⠁⠀⢰⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢹⠖⠲⠤⠤⠤⠤⠤⠤⢶⡖⠚⠉⠀⠀⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⠤⠤⠤⠤⠔⠋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢤⡀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠑⠒⠒⠋⠂⠐⠒⠀⠀⠒⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
            `  ⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣠⠾⠛⠶⣄⢀⣠⣤⠴⢦⡀
  ⠀⠀⠀⢠⡿⠉⠉⠉⠛⠶⠶⠖⠒⠒⣾⠋⠀⢀⣀⣙⣯⡁⠀⠀⠀⣿
  ⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⢯⣼⠋⠉⠙⢶⠞⠛⠻⣆
  ⠀⠀⠀⢸⣧⠆⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣤⡤⢿⡀⠀⢀⣼⣷⠀⠀⣽
  ⠀⠀⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⢏⡉⠁⣠⡾⣇
  ⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠉⠀⢻⡀
  ⣀⣠⣼⣧⣤⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠐⠖⢻⡟⠓⠒
  ⠀⠀⠈⣷⣀⡀⠀⠘⠿⠇⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠿⠟⠀⠀⠀⠲⣾⠦⢤
  ⠀⠀⠋⠙⣧⣀⡀⠀⠀⠀⠀⠀⠀⠘⠦⠼⠃⠀⠀⠀⠀⠀⠀⠀⢤⣼⣏
  ⠀⠀⢀⠴⠚⠻⢧⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠞⠉⠉⠓
  ⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠶⠶⠶⣶⣤⣴⡶⠶⠶⠟⠛⠉`,
            `⠀⢀⠤⠤⣀ ⠀⡠ ⠉⠉⡀
⠀⡅⠀   ⠤⠉⢱⠤ ⠀ ⡄
⠀⠸⡀⠀⡠⠃⠈⠒⠤⠐
　　　　　　　      ⢀⠒⠒⠤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀    ⢂  ⠀⠤⠜ ⠔⠈⠉ ⠢
　　　　   ⢀⣀⠀    ⠐⠄⡀⠤⠒⡊⠐     ⠌
⠀  ⠤⠤ ⠀⠔⠀    ⢃  ⠀⠀⠀⠀⠀⠀  ⠒⠤ ⠊
 ⠎ ⠀ ⠤⡎ ⠦ 　  ⡸
 ⠈⡄⠀⠀⡠⠀ ⠉
⠀⠀⠉⠉`
        ]
    },
    'characters': {
        name: '캐릭터',
        arts: [
            `⠀⠀⠀⠀⣾⣿⣿⣷⣄
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣧⣴⣶⣶⣶⣄
⠀⠀⠀⣀⣿⣿⡿⠻⣿⣿⣿⣿⣿⣿⣿⡄
⠀⠀⠀⢇⠠⣏⡖⠒⣿⣿⣿⣿⣿⣿⣿⣧⡀
⠀⠀⢀⣷⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷
⠀⠀⢸⣿⣿⡿⢋⠁⠀⠀⠀⠀⠉⡙⢿⣿⣿⡇
⠀⠀⠘⣿⣿⠀⣿⠇⠀⢀⠀⠀⠘⣿⠀⣿⡿⠁
⠀⠀⠀⠈⠙⠷⠤⣀⣀⣐⣂⣀⣠⠤⠾⠋⠁`
        ]
    },
    'patterns': {
        name: '패턴',
        arts: [
            `  ⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣠⠾⠛⠶⣄⢀⣠⣤⠴⢦⡀
  ⠀⠀⠀⢠⡿⠉⠉⠉⠛⠶⠶⠖⠒⠒⣾⠋⠀⢀⣀⣙⣯⡁⠀⠀⠀⣿
  ⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⢯⣼⠋⠉⠙⢶⠞⠛⠻⣆
  ⠀⠀⠀⢸⣧⠆⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣤⡤⢿⡀⠀⢀⣼⣷⠀⠀⣽
  ⠀⠀⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⢏⡉⠁⣠⡾⣇
  ⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠉⠀⢻⡀
  ⣀⣠⣼⣧⣤⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠐⠖⢻⡟⠓⠒
  ⠀⠀⠈⣷⣀⡀⠀⠘⠿⠇⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠿⠟⠀⠀⠀⠲⣾⠦⢤
  ⠀⠀⠋⠙⣧⣀⡀⠀⠀⠀⠀⠀⠀⠘⠦⠼⠃⠀⠀⠀⠀⠀⠀⠀⢤⣼⣏
  ⠀⠀⢀⠴⠚⠻⢧⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠞⠉⠉⠓
  ⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠶⠶⠶⣶⣤⣴⡶⠶⠶⠟⠛⠉`
        ]
    },
    'simple': {
        name: '심플',
        arts: [
            `⠀⢀⠤⠤⣀ ⠀⡠ ⠉⠉⡀
⠀⡅⠀   ⠤⠉⢱⠤ ⠀ ⡄
⠀⠸⡀⠀⡠⠃⠈⠒⠤⠐
　　　　　　　      ⢀⠒⠒⠤
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀    ⢂  ⠀⠤⠜ ⠔⠈⠉ ⠢
　　　　   ⢀⣀⠀    ⠐⠄⡀⠤⠒⡊⠐     ⠌
⠀  ⠤⠤ ⠀⠔⠀    ⢃  ⠀⠀⠀⠀⠀⠀  ⠒⠤ ⠊
 ⠎ ⠀ ⠤⡎ ⠦ 　  ⡸
 ⠈⡄⠀⠀⡠⠀ ⠉
⠀⠀⠉⠉`,
            `  ⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣠⠾⠛⠶⣄⢀⣠⣤⠴⢦⡀
  ⠀⠀⠀⢠⡿⠉⠉⠉⠛⠶⠶⠖⠒⠒⣾⠋⠀⢀⣀⣙⣯⡁⠀⠀⠀⣿
  ⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⢯⣼⠋⠉⠙⢶⠞⠛⠻⣆
  ⠀⠀⠀⢸⣧⠆⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣤⡤⢿⡀⠀⢀⣼⣷⠀⠀⣽
  ⠀⠀⠀⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⢏⡉⠁⣠⡾⣇
  ⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠋⠉⠀⢻⡀
  ⣀⣠⣼⣧⣤⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠐⠖⢻⡟⠓⠒
  ⠀⠀⠈⣷⣀⡀⠀⠘⠿⠇⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠿⠟⠀⠀⠀⠲⣾⠦⢤
  ⠀⠀⠋⠙⣧⣀⡀⠀⠀⠀⠀⠀⠀⠘⠦⠼⠃⠀⠀⠀⠀⠀⠀⠀⢤⣼⣏
  ⠀⠀⢀⠴⠚⠻⢧⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠞⠉⠉⠓
  ⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠶⠶⠶⣶⣤⣴⡶⠶⠶⠟⠛⠉`
        ]
    }
};

// 전체 도트아트 목록 생성 (중복 제거)
const allArtsSet = new Set();
Object.keys(dotArtCategories).forEach(key => {
    if (key !== 'all') {
        dotArtCategories[key].arts.forEach(art => {
            allArtsSet.add(art);
        });
    }
});
dotArtCategories.all.arts = Array.from(allArtsSet);

// DOM 요소
let artGrid, artCount, copyToast, copyToastText;
let allArts = [];

// 초기화 함수
function init() {
    // DOM 요소 가져오기
    artGrid = document.getElementById('artGrid');
    copyToast = document.getElementById('copyToast');
    copyToastText = document.getElementById('copyToastText');
    artCount = document.getElementById('artCount');

    if (!artGrid || !copyToast || !copyToastText || !artCount) {
        console.error('필수 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    // 초기 도트아트 표시 (전체)
    displayArts(dotArtCategories.all.arts);
}

// 카테고리 버튼 생성
function createCategoryButtons() {
    const categories = Object.keys(dotArtCategories);
    
    categories.forEach((categoryKey, index) => {
        const category = dotArtCategories[categoryKey];
        const button = document.createElement('button');
        button.className = 'btn btn-preset font-style-btn';
        if (index === 0) button.classList.add('active');
        button.dataset.category = categoryKey;
        button.textContent = category.name;
        
        button.addEventListener('click', () => {
            // 활성화 상태 업데이트
            document.querySelectorAll('.font-style-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            currentCategory = categoryKey;
            displayArts(dotArtCategories[categoryKey].arts);
        });
        
        categoryGrid.appendChild(button);
    });
}

// 도트아트 표시
function displayArts(arts) {
    // 중복 제거
    const uniqueArts = [...new Set(arts)];
    allArts = uniqueArts;
    artGrid.innerHTML = '';
    artCount.textContent = `${uniqueArts.length}개`;
    
    uniqueArts.forEach(art => {
        const artItem = document.createElement('div');
        artItem.className = 'emoji-item dot-art-item';
        artItem.style.fontFamily = 'monospace';
        artItem.style.whiteSpace = 'pre';
        artItem.style.fontSize = '10px';
        artItem.style.lineHeight = '1.2';
        artItem.style.overflow = 'auto';
        artItem.style.maxHeight = 'none';
        artItem.style.minHeight = '200px';
        artItem.textContent = art;
        artItem.title = '클릭하여 복사';
        
        artItem.addEventListener('click', () => {
            copyArt(art);
        });
        
        artGrid.appendChild(artItem);
    });
}

// 도트아트 복사
function copyArt(art) {
    navigator.clipboard.writeText(art).then(() => {
        showCopyToast('도트아트가 복사되었습니다!');
    }).catch(err => {
        console.error('복사 실패:', err);
        showCopyToast('복사에 실패했습니다.');
    });
}

// 복사 토스트 표시
function showCopyToast(message) {
    copyToastText.textContent = message;
    copyToast.style.display = 'flex';
    
    setTimeout(() => {
        copyToast.style.opacity = '0';
        setTimeout(() => {
            copyToast.style.display = 'none';
            copyToast.style.opacity = '1';
        }, 300);
    }, 2000);
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

