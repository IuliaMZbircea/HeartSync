<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use App\Entity\Doctor;

class JWTCreatedListener
{
    public function __construct(private EntityManagerInterface $em) {}

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if ($user instanceof Doctor) {
            $user->setLastLoginAt(new \DateTime());
            $this->em->flush();
        }
    }
}
