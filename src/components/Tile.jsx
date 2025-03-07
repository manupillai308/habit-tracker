import className from 'classnames';

function Tile({children, isSelected, ...rest}){
    const classes = className(
        rest.className,
        'tile-container',
        'is-clickable',
        isSelected && 'has-background-primary has-text-weight-bold',
        'has-border-sm'
      );
    return (
        <div {...rest} className={classes}>
            {children}
        </div>
    );
}

export default Tile;