import { Color, CssProperty, InheritedCssProperty, Length, Style, makeParser, makeValidator, LengthType } from '@nativescript/core';

function createGetter(key) {
    return function () {
        return this.style[key];
    };
}
function createSetter(key) {
    return function (newVal) {
        this.style[key] = newVal;
    };
}

export const cssProperty = (target: Object, key: string | symbol) => {
    Object.defineProperty(target, key, {
        get: createGetter(key),
        set: createSetter(key),
        enumerable: true,
        configurable: true
    });
};

export const rippleColorProperty = new CssProperty<Style, Color>({
    name: 'rippleColor',
    cssName: 'ripple-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v)
});
rippleColorProperty.register(Style);
export const elevationProperty = new CssProperty<Style, LengthType>({
    name: 'elevation',
    cssName: 'elevation',

    valueConverter: parseFloat
});
elevationProperty.register(Style);
export const dynamicElevationOffsetProperty = new CssProperty<Style, LengthType>({
    name: 'dynamicElevationOffset',
    cssName: 'dynamic-elevation-offset',

    valueConverter: parseFloat
});
dynamicElevationOffsetProperty.register(Style);

export const variantProperty = new CssProperty<Style, string>({
    name: 'variant',
    cssName: 'variant'
});
variantProperty.register(Style);

export const shapeProperty = new CssProperty<Style, string>({
    name: 'shape',
    cssName: 'shape'
});
shapeProperty.register(Style);
