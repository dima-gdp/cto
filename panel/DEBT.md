---

#### Остутствие фронтенд арихтектуры в панели CTO

**scope**
Panel
**link**:
[CTO-1917](https://studio256.atlassian.net/browse/CTO-1917)
**description**
В панели много сложных интерфейсов, которые плохо ложаться в RES T API структуру. Неободим слой-прослойка над API
Необходимо разработать план внедрения
**reason**
Не учли при разработке
Изменились требования к проекту
**consequences**
Любая работа с интерфейсами в панели занимает больше времени и когнитивных усилий чем могла бы

---

#### Некоректная работа селекта iview с асинхронным поиском

**scope**
Select
**link**:
[CTO-1913](https://studio256.atlassian.net/browse/CTO-1913)
**description**
Iview Select не поддерживает возможность выбирать начальную опцию для асинхронного селекта
Нужно разработать компонент (Взять за основу vue-multiselect) который это умеет, и стилизовать его под ui-kit СТО

PS.Такое реализовано в MED public.
**reason**
Iview
**consequences**
В некоторых случаях приходится запрашивать все сущности для опций селекта, или придумывать неудобные интерфейсы

---

#### Тяжело поддерживающийся(ужасный) код в фильтрах таблиц

**scope**
Tables
**link**:
[CTO-2018](https://studio256.atlassian.net/browse/CTO-2018)
**description**
Устаревший код фильтра таблиц, на который со временем докидывались фичи в стиле - "Воткни как-нибудь".
В итоге все превратилось в бардак.
**reason**
Изменение требований, устаревание функционала.
**consequences**
Усложнения работы с листингами и фильтрацией

---