(function() {
  'use strict';

  function createButton(id, label, onClick) {
    var button = document.createElement('button');
    button.id = id;
    button.className = 'custom-kintone-button';
    button.type = 'button';
    button.innerText = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function addButtonToRecordDetail(event) {
    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (!headerSpace || document.getElementById('custom-kintone-button-detail')) {
      return event;
    }

    var button = createButton('custom-kintone-button-detail', 'チェック', function() {
      var record = event.record;
      var recordId = record.$id ? record.$id.value : '(未取得)';
      var recordTitle = record['レコード番号'] ? record['レコード番号'].value : '(フィールドなし)';
      alert('このレコードのID: ' + recordId + '\nタイトル: ' + recordTitle);
    });

    headerSpace.appendChild(button);
    return event;
  }

  function addButtonToRecordEdit(event) {
    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (!headerSpace || document.getElementById('custom-kintone-button-filter')) {
      return event;
    }

    var filterButton = createButton('custom-kintone-button-filter', 'フィルタ', function() {
      var record = event.record;
      var sample2 = record.sample2;
      if (sample2 && sample2.value === true) {
        alert('このレコードのsample2はチェックされています。');
      } else {
        alert('このレコードのsample2はチェックされていません。');
      }
    });

    // 保存ボタンの右側に配置
    var saveButton = document.querySelector('[data-testid="record-header-save-button"], .gaia-button-save, button[class*="save"]');
    if (saveButton && saveButton.parentNode) {
      saveButton.parentNode.insertBefore(filterButton, saveButton.nextSibling);
    } else {
      // フォールバック：ヘッダースペースに追加
      headerSpace.appendChild(filterButton);
    }
    return event;
  }

  function addButtonToIndex(event) {
    var headerSpace = kintone.app.getHeaderMenuSpaceElement();
    if (!headerSpace || document.getElementById('custom-kintone-button-index')) {
      return event;
    }

    var button = createButton('custom-kintone-button-index', 'フィルタ', function() {
      // 一覧画面のレコードを取得
      var records = kintone.app.getRecords();
      
      // sample2フィールドがチェックされているレコードのセルをグレーアウト
      records.records.forEach(function(record, index) {
        var sample2 = record.sample2;
        if (sample2 && sample2.value === true) {
          // 該当行のセルに対してグレーアウト処理を適用
          var row = document.querySelector('[data-id="' + record.$id.value + '"]');
          if (row) {
            row.classList.add('grayed-out');
          }
        }
      });
      
      alert('sample2がチェックされているレコードをグレーアウトしました。');
    });

    headerSpace.appendChild(button);
    return event;
  }

  kintone.events.on('app.record.detail.show', addButtonToRecordDetail);
  kintone.events.on('app.record.edit.show', addButtonToRecordEdit);
  kintone.events.on('app.record.index.show', addButtonToIndex);
})();
