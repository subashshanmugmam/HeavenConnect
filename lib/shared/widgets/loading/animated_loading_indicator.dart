import 'package:flutter/material.dart';
import 'dart:math' as math;

/// Custom animated loading indicator with multiple animation styles
class AnimatedLoadingIndicator extends StatefulWidget {
  final double size;
  final Color color;
  final Duration duration;
  final LoadingAnimationType type;
  final String? text;

  const AnimatedLoadingIndicator({
    super.key,
    this.size = 50.0,
    this.color = Colors.blue,
    this.duration = const Duration(milliseconds: 1500),
    this.type = LoadingAnimationType.ripple,
    this.text,
  });

  @override
  State<AnimatedLoadingIndicator> createState() =>
      _AnimatedLoadingIndicatorState();
}

class _AnimatedLoadingIndicatorState extends State<AnimatedLoadingIndicator>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _pulseController;
  late AnimationController _rotationController;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    )..repeat();

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat(reverse: true);

    _rotationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: widget.size,
          height: widget.size,
          child: _buildAnimatedIndicator(),
        ),
        if (widget.text != null) ...[
          const SizedBox(height: 16),
          Text(
            widget.text!,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: widget.color,
                  fontWeight: FontWeight.w500,
                ),
          ),
        ],
      ],
    );
  }

  Widget _buildAnimatedIndicator() {
    switch (widget.type) {
      case LoadingAnimationType.ripple:
        return _buildRippleAnimation();
      case LoadingAnimationType.pulse:
        return _buildPulseAnimation();
      case LoadingAnimationType.spin:
        return _buildSpinAnimation();
      case LoadingAnimationType.bounce:
        return _buildBounceAnimation();
      case LoadingAnimationType.wave:
        return _buildWaveAnimation();
      case LoadingAnimationType.dots:
        return _buildDotsAnimation();
    }
  }

  Widget _buildRippleAnimation() {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            _buildRipple(0.0),
            _buildRipple(0.5),
          ],
        );
      },
    );
  }

  Widget _buildRipple(double delay) {
    final animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Interval(delay, 1.0, curve: Curves.easeOut),
    ));

    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Transform.scale(
          scale: animation.value,
          child: Opacity(
            opacity: 1.0 - animation.value,
            child: Container(
              width: widget.size,
              height: widget.size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: widget.color,
                  width: 2.0,
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPulseAnimation() {
    return AnimatedBuilder(
      animation: _pulseController,
      builder: (context, child) {
        return Transform.scale(
          scale: 0.7 + (_pulseController.value * 0.3),
          child: Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: widget.color.withValues(alpha: 0.7),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSpinAnimation() {
    return AnimatedBuilder(
      animation: _rotationController,
      builder: (context, child) {
        return Transform.rotate(
          angle: _rotationController.value * 2.0 * math.pi,
          child: Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: SweepGradient(
                colors: [
                  widget.color.withValues(alpha: 0.1),
                  widget.color,
                ],
                stops: const [0.0, 1.0],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildBounceAnimation() {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final bounceValue = Curves.elasticOut.transform(
          (_controller.value * 2) % 1.0,
        );
        return Transform.translate(
          offset: Offset(0, -20 * bounceValue),
          child: Container(
            width: widget.size * 0.6,
            height: widget.size * 0.6,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: widget.color,
            ),
          ),
        );
      },
    );
  }

  Widget _buildWaveAnimation() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(5, (index) {
        return AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            final animationValue = (_controller.value - (index * 0.1)) % 1.0;
            final height = widget.size * 0.2 +
                (widget.size * 0.6 * math.sin(animationValue * math.pi));
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 2),
              width: widget.size * 0.15,
              height: height,
              decoration: BoxDecoration(
                color: widget.color,
                borderRadius: BorderRadius.circular(widget.size * 0.075),
              ),
            );
          },
        );
      }),
    );
  }

  Widget _buildDotsAnimation() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(3, (index) {
        return AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            final animationValue = (_controller.value - (index * 0.2)) % 1.0;
            final scale = 0.5 + (0.5 * math.sin(animationValue * math.pi));
            return Transform.scale(
              scale: scale,
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 1),
                width: widget.size * 0.15,
                height: widget.size * 0.15,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.color,
                ),
              ),
            );
          },
        );
      }),
    );
  }
}

enum LoadingAnimationType {
  ripple,
  pulse,
  spin,
  bounce,
  wave,
  dots,
}
