import type React from 'react';

declare function comDefaultProps<P extends object, D extends Partial<P>>(
  component: React.ComponentType<P> | React.ForwardRefExoticComponent<P & React.RefAttributes<any>>,
  defaultProps: D
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Partial<P>> & React.RefAttributes<any>
>;

export default comDefaultProps;
