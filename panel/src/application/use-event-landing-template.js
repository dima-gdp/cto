export default function useLandingTemplate() {
  /**
   * Возвращает колонки для таблицы
   * @returns {Array}
   */
  function getColumns() {
    return [
      {
        title: 'ID',
        key: 'id',
        type: 'integer',
        searchable: true,
        sortable: true,
        sortType: 'desc',
        maxWidth: 70,
      },
      {
        title: 'Название',
        key: 'name',
        type: 'string',
        searchable: true,
        sortable: true,
        sortType: 'desc',
      },
      {
        title: '',
        key: 'handle',
        options: [
          {
            name: 'Редактировать',
            action: 'on-edit',
            access: ['it', 'administrator'],
          },
          {
            name: 'Удаление',
            action: 'on-delete',
            style: {
              color: '#ed4014',
            },
            access: ['it', 'administrator'],
          },
        ],
        slot: 'actions',
        align: 'center',
        maxWidth: 70,
      },
    ]
  }

  return {
    getColumns,
  }
}
