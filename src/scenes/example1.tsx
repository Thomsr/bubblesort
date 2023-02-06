import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Text } from '@motion-canvas/2d/lib/components/'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { createRef, makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Spacing } from '@motion-canvas/core/lib/types';
import { Colors } from '../styles'
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';


export default makeScene2D(function* (view) {
    const Elements: Rect[] = [];
    const Array1 = [6, 5, 3, 1, 8, 7, 2]

    const Array = createRef<Rect>();
    
    const boxStyle = {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    }

    const textStyle = {
        fontSize: 60,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    for(let i = 0; i < Array1.length; i++){
        view.add(
            <Rect
                ref={makeRef(Elements, i)}
                height={128}
                width={128}
                lineWidth={8}
                radius={new Spacing(4)}
                x={-((Array1.length * (128 + 28)) / 2) + i * (128 + 28) + (128 + 28) / 2 }
            >
                <Text text={Array1[i].toString()} {...textStyle} />
            </Rect>
        )
    }
    
    yield* waitUntil('Steps');
    yield* Steps(Elements);
    yield* waitUntil('Compares');
    yield* Compares(Elements[2], Elements[3]);
    yield* waitUntil('Swaps');
    yield* Swaps(Elements[2], Elements[3]);
    yield* waitUntil('Next');
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
    yield* all(
        Element1.absolutePosition(Element2.absolutePosition(), 1),
        Element2.absolutePosition(E1, 1),
    )
}