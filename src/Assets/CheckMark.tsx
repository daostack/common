import * as React  from 'react';
import {SvgXml} from 'react-native-svg';

const xml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd">
        <g fill="#7786FF" fill-rule="nonzero">
            <g>
                <g>
                    <g>
                        <g>
                            <g>
                                <path d="M7.243 11.453c-.726.73-1.903.73-2.628 0L.545 7.357c-.726-.729-.726-1.913 0-2.643.724-.73 1.901-.73 2.627 0l2.425 2.44c.183.184.48.184.664 0L12.828.547c.725-.73 1.903-.73 2.628 0 .348.35.544.826.544 1.322 0 .495-.196.97-.544 1.321l-8.213 8.263z" transform="translate(-24 -498) translate(0 75) translate(24 38) translate(0 349) translate(0 36) translate(4 6)"/>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;

export default () => <SvgXml xml={xml} width="100%" height="100%" />;

