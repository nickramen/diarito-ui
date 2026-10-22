(() => {
  'use strict';
  const sections = [...document.querySelectorAll('[data-doc-section]')];
  const links = [...document.querySelectorAll('[data-doc-nav]')];
  if (!('IntersectionObserver' in window) || !sections.length) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-20% 0px -70% 0px', threshold: [0,.15,.5] });
  sections.forEach((section) => observer.observe(section));

  document.querySelectorAll('[data-demo-feed-tabs]').forEach((root) => {
    const buttons = [...root.querySelectorAll('button')];
    buttons.forEach((button) => button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    }));
  });

  document.querySelectorAll('[data-demo-feed-composer]').forEach((composer) => {
    const input = composer.querySelector('[data-demo-feed-input]');
    const submit = composer.querySelector('[data-demo-feed-submit]');
    const feed = composer.closest('[data-demo-feed]');
    if (!input || !submit || !feed) return;
    const publish = () => {
      const value = input.value.trim();
      if (!value) return;
      const article = document.createElement('article');
      article.className = 'diarito-feed-item';
      article.innerHTML = `
        <span class="diarito-avatar">N</span>
        <div class="diarito-feed-item__main">
          <div class="diarito-feed-item__header"><strong>nickramen</strong><span>· now</span></div>
          <div class="diarito-feed-item__text"><p></p></div>
          <div class="diarito-feed-item__tags"><span class="diarito-tag diarito-tag--dark">new post</span></div>
          <div class="diarito-feed-actions">
            <button class="diarito-feed-action" type="button"><i class="fi fi-rr-comment"></i> 0</button>
            <button class="diarito-feed-action" type="button"><i class="fi fi-rr-heart"></i> 0</button>
            <button class="diarito-feed-action" type="button"><i class="fi fi-rr-bookmark"></i></button>
          </div>
        </div>`;
      article.querySelector('.diarito-feed-item__text p').textContent = value;
      composer.insertAdjacentElement('afterend', article);
      input.value = '';
      input.focus();
    };
    submit.addEventListener('click', publish);
    input.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') publish();
    });
  });


  document.querySelectorAll('[data-demo-table]').forEach((root) => {
    const search = root.querySelector('[data-demo-table-search]');
    const rows = [...root.querySelectorAll('[data-demo-table-row]')];
    const count = root.querySelector('[data-demo-table-count]');
    const empty = root.querySelector('[data-demo-table-empty]');
    const modal = document.getElementById(root.dataset.demoTableFilterModalId || '');
    const filterCount = root.querySelector('[data-demo-table-filter-count]');
    const controls = {
      status: modal?.querySelector('[data-demo-table-filter-status]'),
      role: modal?.querySelector('[data-demo-table-filter-role]'),
      native: modal?.querySelector('[data-demo-table-filter-native]'),
      learning: modal?.querySelector('[data-demo-table-filter-learning]')
    };
    const applied = { status: '', role: '', native: '', learning: '' };

    const syncModal = () => {
      Object.entries(controls).forEach(([key, control]) => {
        if (control) control.value = applied[key];
      });
    };

    const renderFilterCount = () => {
      const activeCount = Object.values(applied).filter(Boolean).length;
      if (!filterCount) return;
      filterCount.textContent = String(activeCount);
      filterCount.hidden = activeCount === 0;
    };

    const applyFilters = () => {
      const query = (search?.value || '').trim().toLowerCase();
      let visible = 0;

      rows.forEach((row) => {
        const matchesQuery = !query || row.textContent.toLowerCase().includes(query);
        const matchesStatus = !applied.status || row.dataset.status === applied.status;
        const matchesRole = !applied.role || row.dataset.role === applied.role;
        const matchesNative = !applied.native || row.dataset.native === applied.native;
        const matchesLearning = !applied.learning || row.dataset.learning === applied.learning;
        const show = matchesQuery && matchesStatus && matchesRole && matchesNative && matchesLearning;
        row.hidden = !show;
        if (show) visible += 1;
      });

      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
      renderFilterCount();
    };

    search?.addEventListener('input', applyFilters);

    modal?.querySelector('[data-demo-table-filter-clear]')?.addEventListener('click', () => {
      Object.values(controls).forEach((control) => {
        if (control) control.value = '';
      });
    });

    modal?.querySelector('[data-demo-table-filter-apply]')?.addEventListener('click', () => {
      Object.entries(controls).forEach(([key, control]) => {
        applied[key] = control?.value || '';
      });
      applyFilters();
      modal.close();
    });

    modal?.addEventListener('close', syncModal);
    syncModal();
    applyFilters();
  });


  document.querySelectorAll('[data-demo-table-states]').forEach((root) => {
    const segmented = root.querySelector('[data-diarito-segmented]');
    const panels = [...root.querySelectorAll('[data-demo-table-state-panel]')];
    if (!segmented || !panels.length) return;
    segmented.addEventListener('diarito:segmentchange', (event) => {
      const value = event.detail?.value;
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.demoTableStatePanel !== value;
      });
    });
  });


  document.querySelectorAll('[data-demo-entry-composer]').forEach((composer) => {
    const input = composer.querySelector('[data-demo-entry-input]');
    const publish = composer.querySelector('[data-demo-entry-publish]');
    const state = composer.querySelector('[data-demo-save-state]');
    if (!input || !publish || !state) return;

    let saveTimer = 0;
    const setState = (mode, icon, text) => {
      state.className = `diarito-save-state diarito-save-state--${mode}`;
      state.innerHTML = `<i class="${icon}"></i> ${text}`;
    };

    input.addEventListener('input', () => {
      window.clearTimeout(saveTimer);
      setState('unsaved', 'fi fi-rr-circle-small', 'Unsaved changes');
      saveTimer = window.setTimeout(() => {
        setState('saving', 'fi fi-rr-refresh', 'Saving...');
        saveTimer = window.setTimeout(() => setState('saved', 'fi fi-rr-check-circle', 'Saved just now'), 500);
      }, 450);
    });

    publish.addEventListener('click', () => {
      const value = input.value.trim();
      if (!value) {
        window.DiaritoToast?.show({ title: 'Write something first', message: 'Your entry is still empty.', state: 'warning' });
        input.focus();
        return;
      }
      setState('saved', 'fi fi-rr-check-circle', 'Published');
      window.DiaritoToast?.show({ title: 'Entry published', message: 'Demo only. No entry was stored.', state: 'success' });
    });
  });

  document.querySelectorAll('[data-diarito-toggle="follow"]').forEach((button) => {
    button.addEventListener('diarito:togglechange', (event) => {
      button.innerHTML = event.detail?.active
        ? '<i class="fi fi-rr-check"></i> Following'
        : '<i class="fi fi-rr-user-add"></i> Follow';
    });
  });

  document.querySelectorAll('.diarito-visibility-selector [data-diarito-segmented]').forEach((segmented) => {
    const root = segmented.closest('.diarito-visibility-selector');
    const summary = root?.querySelector('.diarito-visibility-selector__summary span');
    if (!summary) return;
    const messages = {
      private: 'Private entries are visible only to you.',
      shared: 'Shared entries are visible only to people you choose.',
      public: 'Public entries can appear in the community feed.'
    };
    segmented.addEventListener('diarito:segmentchange', (event) => {
      summary.textContent = messages[event.detail?.value] || messages.private;
    });
  });


  document.querySelectorAll('[data-demo-reply-composer]').forEach((composer) => {
    const input = composer.querySelector('[data-demo-reply-input]');
    const submit = composer.querySelector('[data-demo-reply-submit]');
    const list = composer.parentElement?.querySelector('[data-demo-reply-list]');
    if (!input || !submit || !list) return;

    const publishReply = () => {
      const value = input.value.trim();
      if (!value) return;
      const article = document.createElement('article');
      article.className = 'diarito-comment';
      article.innerHTML = `
        <span class="diarito-avatar">N</span>
        <div class="diarito-comment__main">
          <div class="diarito-comment__header"><strong>nickramen</strong><span>· now</span></div>
          <div class="diarito-comment__body"><p></p></div>
          <div class="diarito-comment__actions"><button class="diarito-entry-action" type="button">Reply</button></div>
        </div>`;
      article.querySelector('p').textContent = value;
      list.prepend(article);
      input.value = '';
      input.focus();
    };

    submit.addEventListener('click', publishReply);
    input.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') publishReply();
    });
  });

  document.querySelectorAll('[data-diarito-toggle="accept-correction"]').forEach((button) => {
    button.addEventListener('diarito:togglechange', (event) => {
      button.innerHTML = event.detail?.active
        ? '<i class="fi fi-rr-check"></i> Accepted'
        : '<i class="fi fi-rr-check"></i> Accept suggestion';
    });
  });

})();