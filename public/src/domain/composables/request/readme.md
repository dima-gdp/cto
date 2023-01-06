Сущность "Материалы" (material) названа так в документации (Функция "Приём материалов").
В базе она соответствует сущности _Request_. Поэтому и в панели и в паблике она называется _Request_
До этого она называлась Обращением или Тезисом.

Чтобы отличать "материал" (те возможность отправить материал определенного типа) от той сущности, которую отправляет юзер, они по разному называются: _Material_ и _UserMaterial_:  
У _Request_ есть связь с формой, которую должен заполнять пользователь, чтобы составить _UserRequest_

Есть ограничения по дате и по количеству на подачу пользователем материала (те на создание _UserRequest_). О них подробно написано в документации

Ссылки на документацию:

- [Прием материалов](https://www.notion.so/studio256/6d4aa6151a73462eaddb58604ff3d3f5)
- [Ограничения по количеству материалов на одного пользователя](https://www.notion.so/3456b117d35644798463a41213fc2b38)
- [Oграничения общего количество поданных материалов](https://www.notion.so/studio256/456de155d7bc40f2b21acce4be7cfec2)