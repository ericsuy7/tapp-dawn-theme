(() => {
  const picker = [...document.querySelectorAll('variant-selects[data-product-title], variant-selects[data-product-handle]')].find(
    (element) =>
      element.dataset.productHandle?.trim().toLowerCase() === 'tap-nfc-card' ||
      element.dataset.productTitle?.trim().toLowerCase() === 'tap nfc card'
  );
  if (!picker) return;

  const optionGroups = [...picker.querySelectorAll('.product-form__input')];
  const colorIndex = optionGroups.findIndex((group) =>
    /color/i.test(group.querySelector('legend, label')?.textContent || '')
  );
  const colorGroup = optionGroups[colorIndex];

  const readColor = () => {
    if (!colorGroup) return '';
    return (
      colorGroup.querySelector('input[type="radio"]:checked')?.value ||
      colorGroup.querySelector('select')?.value ||
      colorGroup.querySelector('[data-selected-value]')?.textContent.trim() ||
      ''
    );
  };

  const setColorway = (value) => {
    const color = String(value || '').trim().toLowerCase();
    if (color.includes('pink')) {
      document.documentElement.dataset.tappColorway = 'pink';
    } else if (color.includes('transparent')) {
      document.documentElement.dataset.tappColorway = 'transparent';
    } else {
      delete document.documentElement.dataset.tappColorway;
    }
  };

  setColorway(readColor());

  document.addEventListener('change', (event) => {
    if (!picker.contains(event.target)) return;
    setColorway(readColor());
  });

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, ({ data }) => {
      if (data?.sectionId !== picker.dataset.section) return;
      const selectedValue = data.variant?.options?.[colorIndex] || data.variant?.title;
      setColorway(selectedValue);
    });
  }
})();
