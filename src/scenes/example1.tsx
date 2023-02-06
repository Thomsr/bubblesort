import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {Layout, Rect, Node, Line, Text} from '@motion-canvas/2d/lib/components/'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { createRef, makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Spacing } from '@motion-canvas/core/lib/types';
import { Colors } from '../styles'
import { easeInCubic, easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';


export default makeScene2D(function* (view) {
    const Elements: Rect[] = [];
    const Array1 = ['1', '2', '3', '4', '5', '6', '7']

    const Array = createRef<Rect>();
    
    const boxStyle = {
        width: 128,
        height: 128,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    }

    const textStyle = {
        fontSize: 60,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    view.add(
    <>
        <Rect ref={makeRef(Elements, 0)} {...boxStyle}>
            <Text text={Array1[0]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 1)} {...boxStyle}>
            <Text text={Array1[1]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 2)} {...boxStyle}>
            <Text text={Array1[2]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 3)} {...boxStyle}>
            <Text text={Array1[3]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 4)} {...boxStyle}>
            <Text text={Array1[4]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 5)} {...boxStyle}>
            <Text text={Array1[5]} {...textStyle}></Text>
        </Rect>
        <Rect ref={makeRef(Elements, 6)} {...boxStyle}>
            <Text text={Array1[6]} {...textStyle}></Text>
        </Rect>
    </>
    )

    for(let i = 0; i < Elements.length; i++){
        const Element = Elements[i];

        Element.position.x(-(Elements.length/2 - i).toFixed(2) * (128 + 28));

        Element.lineWidth(8);
        Element.stroke('#242424');
        Element.radius(new Spacing(4))
    }
    
    yield* waitUntil('Steps');
    yield* Steps(Elements);
    yield* waitUntil('Compares');
    yield* Compares(Elements[3], Elements[4]);
    yield* waitUntil('Swaps');
    yield* Swaps(Elements[3], Elements[4]);
    yield* waitFor(10);
})

function* Steps(Elements: Rect[]){
    Elements[0].stroke(Colors.green)
    yield* waitFor(0.2)
    for(let i = 1; i < 7; i++){
        Elements[i-1].stroke('#242424');
        Elements[i].stroke(Colors.green);
        yield* waitFor(0.2);
    }
    Elements[Elements.length-1].stroke('#242424');
} 

function* Compares(Element1: Rect, Element2: Rect){
    yield* all(
        tween(.5, color => {
            Element1.stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.blue),
                    easeInOutCubic(color),
                )
            );
        }),
        tween(.5, color => {
            Element2.stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(Colors.blue),
                    easeInOutCubic(color),
                )
            );
        }),
    )

    yield* waitUntil('next');

    yield* all(
        tween(.3, color => {
            Element1.stroke(
                Color.lerp(
                    new Color(Colors.blue),
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            );
        }),
        tween(.3, color => {
            Element2.stroke(
                Color.lerp(
                    new Color(Colors.blue),
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            );
        }),
    )
}

function* Swaps(Element1: Rect, Element2: Rect){
    const E1 = Element1.absolutePosition();
    yield* Element1.absolutePosition(Element2.absolutePosition(), 1);
    // yield* Element2.absolutePosition(E1);

    // Element2.layout(false, 1);
    // Element1.layout(false);
}