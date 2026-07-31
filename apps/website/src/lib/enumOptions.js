export function formatEnumLabel(value) {
    return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function enumToOptions(values) {
    return values.map((value) => ({ value, label: formatEnumLabel(value) }));
}
