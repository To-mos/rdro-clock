export default class Clock {
    constructor( parentElementName = '.clock', serverSkew = 0 ) {
        this.serverSkew = serverSkew;
        this.makeClock( document.querySelector( parentElementName ) );

        this.update();
    }

    makeClock( parentElement ) {
        const ratioElem = document.createElement( 'div' );
        ratioElem.classList.add( 'ratio' );

        const dialImgElem = document.createElement( 'img' );
        dialImgElem.src = 'img/faceMask.svg';
        const dialElem = document.createElement( 'div' );
        dialElem.classList.add( 'dial' );
        dialElem.appendChild( dialImgElem );

        const hrHandImgElem = document.createElement( 'img' );
        hrHandImgElem.src = 'img/hrHand.svg';
        this.hrHandElem = document.createElement( 'div' );
        this.hrHandElem.classList.add( 'hrHand' );
        this.hrHandElem.appendChild( hrHandImgElem );

        const minHandImgElem = document.createElement( 'img' );
        minHandImgElem.src = 'img/minHand.svg';
        this.minHandElem = document.createElement( 'div' );
        this.minHandElem.classList.add( 'minHand' );
        this.minHandElem.appendChild( minHandImgElem );

        const nightDayImgElem = document.createElement( 'img' );
        nightDayImgElem.src = 'img/nightDay.svg';
        this.nightDayElem = document.createElement( 'div' );
        this.nightDayElem.classList.add( 'nightDay' );
        this.nightDayElem.appendChild( nightDayImgElem );

        const pivotImgElem = document.createElement( 'img' );
        pivotImgElem.src = 'img/pivot.svg';
        const pivotElem = document.createElement( 'div' );
        pivotElem.classList.add( 'pivot' );
        pivotElem.appendChild( pivotImgElem );

        ratioElem.appendChild( dialElem );
        ratioElem.appendChild( this.hrHandElem );
        ratioElem.appendChild( this.minHandElem );
        ratioElem.appendChild( this.nightDayElem );
        ratioElem.appendChild( pivotElem );

        parentElement.appendChild( ratioElem );
    }

    update() {
        const timeScale = 30; // the "magic" behind the clock this scales real time to RDRO time
        const secs = ( Date.now() / 1000 ) * timeScale - this.serverSkew; // convert to RDR time ratio
        const tau = Math.PI * 2;

        // 3600 == 60 min in seconds
        // 43200 == 12 hours in seconds
        // modulus allows you to get sub-remainders of a whole
        // this lets minutes auto wrap around the seconds from the total time
        // and turn them into a percentage of the total spin for tau to use
        const spinHr = ( ( secs % 43200 ) / 43200.0 ) * tau;
        const spinMin = ( ( secs % 3600 ) / 3600.0 ) * tau;
        const spinDayNight = ( ( ( secs - 43200 ) % 86400 ) / 86400.0 ) * tau;

        this.hrHandElem.style.transform = 'rotate( ' + spinHr + 'rad )';
        this.minHandElem.style.transform = 'rotate( ' + spinMin + 'rad )';
        this.nightDayElem.style.transform = 'translate( -50%, -50% ) rotate( ' + spinDayNight + 'rad )';

        requestAnimationFrame( this.update.bind( this ) );
    }
}