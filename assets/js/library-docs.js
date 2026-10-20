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
    const modal = root.querySelector('[data-demo-table-filter-modal]');
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

})();