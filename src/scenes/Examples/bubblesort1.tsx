import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect, Text } from '@motion-canvas/2d/lib/components/'
import { all, waitFor, waitUntil } from '@motion-canvas/core/lib/flow/'
import { makeRef } from '@motion-canvas/core/lib/utils';
import { Color, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { Colors } from '../../styles'
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';

export default makeScene2D(function* (view) {
    const Elements: Rect[] = [];
    const Array1 = [6, 5, 3, 1, 8, 7, 2]

    const textStyle = {
        fontSize: 60,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    for(let i = 0; i < Array1.length; i++){
        view.add(
            <Rect
                opacity={0}
                ref={makeRef(Elements, i)}
                height={128}
                width={128}
                lineWidth={8}
                radius={new Spacing(4)}
                stroke={'#242424'}
                
                x={-((Array1.length * (128 + 28)) / 2) + i * (128 + 28) + (128 + 28) / 2 }
            >
                <Text text={Array1[i].toString()} {...textStyle} />
            </Rect>
        )
    }
    yield* waitUntil('Begin');
    for(let i = 0; i < Array1.length; i++){
        Elements[i].position.y(-50);
        yield* all(
            tween(.5, y => {
                Elements[i].position(
                    Vector2.lerp(
                        new Vector2(Elements[i].position.x(), Elements[i].position.y()),
                        new Vector2(Elements[i].position.x(), 0),
                        easeInOutCubic(y),
                    )
                )
            }),
            Elements[i].opacity(1, .5),
        )
    }
    yield* waitUntil('Beginning');
    yield* HighLight(Elements[0]);

    yield* waitUntil('Compare1');
    yield* deHighLight(Elements[0]);    
    yield* Compares(Elements[0], Elements[1], 1);
    yield* waitUntil('Swap1');
    yield* Swaps(Elements[0], Elements[1]); 

    yield* waitUntil('Compare2');
    yield* Compares(Elements[0], Elements[2], 2);
    yield* Swaps(Elements[0], Elements[2]);

    yield* waitUntil('Compare3');
    yield* Compares(Elements[0], Elements[3], 3);
    yield* Swaps(Elements[0], Elements[3]);

    yield* waitUntil('Compare4');
    yield* Compares(Elements[0], Elements[4], 4);

    yield* waitUntil('Compare5');
    yield* Compares(Elements[4], Elements[5], 5);
    yield* Swaps(Elements[4], Elements[5]);

    yield* waitUntil('Compare6');
    yield* Compares(Elements[4], Elements[6], 6);
    yield* Swaps(Elements[4], Elements[6]);

    yield* waitUntil('Largest')
    yield* HighLight(Elements[4]);

    yield* waitFor(10);
})

function* Compares(Element1: Rect, Element2: Rect, Index: Number){
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

    yield* waitUntil('next-' + Index.toString());

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
    const E2 = Element2.absolutePosition();
    yield* all(
        Element1.absolutePosition(E2, 1),
        Element2.absolutePosition(E1, 1),
    )
    // Element1.absolutePosition(E1);
    // Element2.absolutePosition(E2);
    // Element2.moveUp(); // move them
}

function* HighLight(E: Rect){
    yield* tween(.5, color =>{
        E.stroke(
            Color.lerp(
                new Color('#242424'),
                new Color(Colors.blue),
                easeInOutCubic(color),
            )
        )
    })
}

function* deHighLight(E: Rect){
    yield* tween(.5, color =>{
        E.stroke(
            Color.lerp(
                new Color(Colors.blue),
                new Color('#242424'),
                easeInOutCubic(color),
            )
        )
    })
}