# Vim Cheatsheet (shortcuts)

## Scrolling

| action            | shortcut           |
|-------------------|--------------------|
| by paragraph ⭐⭐ | }, {               |
| by half page      | Ctrl+d, Ctrl+u     |
| by full page      | `ctrl+f`, `ctrl+b` |

## Insert mode

You can hit Control-r to enter the “Registers” mini-mode, which pops up a list of “registers” you can paste from

## Normal mode

| shortcut     | description                                                                     |
|--------------|---------------------------------------------------------------------------------|
| Shift-j      | join lines                                                                      |
| Ctrl-Space   | recursively select larger and larger blocks of text                             |
| Crtl-r       | redo                                                                            |
| 10G          | go to a line number                                                             |
| :10<enter>   | another way to go to line 10                                                    |
| Ctrl-o       | navigate backward                                                               |
| Ctrl-i       | navigate forward                                                                |
| s            | Seek (flask)                                                                    |
| f            | Find mode (press f repeatedly for moving through the results). Related: F, t, T |
| Ctrl-d       | Scroll down half page                                                           |
| Ctrl-u       | Scroll half page                                                                |
| Ctrl-f       | Scroll down full page                                                           |
| Ctrl-b       | Scroll up full page                                                             |
| Ctrl+Shift+u | Emoji Picker                                                                    |

Control-y and Control-e Scroll window without moving the cursor
zt, zb, and zz Scroll window without moving the cursor
w, e, b Moving by words
W, E, B Moving by words disregarding punctuation other than white space
0, ^, $ Line start and end
D, C Delete/change till end of line
dd, cc Delete/change line
d, r Delete / replace single character
~, gu , gU change case

LazyGit

Keyboard bindings to cycle through tabs in a pane
You can use [ and ] to switch between the tabs

Commands
set language :set ft=java
Change directory :cd /dir/dir
Edit file :e file.txt

Completion Tab (also Tab to cycle through menu items, Shift + Tab for previous)

Ctrl + n — next
Ctrl + p — previous

Telescope

Smart Case
Fuzzy find (1) Order of characters is important but you can skip characters. (2) Add space to provide another pattern. Filter results further.
Tab select a result

Grug.far

- To apply multiple file filters, provide the second one in flags as —glob=!*test*
- Use ! In glob to exclude

## Plugins to explore

- <https://github.com/mrjones2014/smart-splits.nvim>
- <https://github.com/HakonHarnes/img-clip.nvim>
- <https://github.com/bullets-vim/bullets.vim>
